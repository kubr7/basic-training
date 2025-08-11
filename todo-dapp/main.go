package main

import (
	"context"
	"crypto/ecdsa"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	_ "github.com/lib/pq"

	contracts "github.com/kubr7/todo-dapp/contract"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

var (
	rpcURL       string
	contractAddr common.Address
	dbURL        string
	privateKey   string

	parsedABI *abi.ABI
)

// Task struct maps to solidity Task tuple
type Task struct {
	Id          *big.Int
	Creator     common.Address
	AssignedTo  common.Address
	Description string
	Date        uint32
	Status      uint8
	IsDeleted   bool
	IsModified  bool
}

// utility: convert Task -> JSON-friendly map
func taskToMap(t Task) map[string]interface{} {
	return map[string]interface{}{
		"id":          t.Id.String(),
		"creator":     t.Creator.Hex(),
		"assignedTo":  t.AssignedTo.Hex(),
		"description": t.Description,
		"date":        t.Date,
		"status":      t.Status,
		"isDeleted":   t.IsDeleted,
		"isModified":  t.IsModified,
	}
}

// utility: convert interface{} result to Task
func interfaceToTask(taskData interface{}) (Task, bool) {
	if slice, ok := taskData.([]interface{}); ok && len(slice) >= 8 {
		task := Task{
			Id:          slice[0].(*big.Int),
			Creator:     slice[1].(common.Address),
			AssignedTo:  slice[2].(common.Address),
			Description: slice[3].(string),
			Date:        slice[4].(uint32),
			Status:      slice[5].(uint8),
			IsDeleted:   slice[6].(bool),
			IsModified:  slice[7].(bool),
		}
		return task, true
	}
	return Task{}, false
}

func init() {
	rpcURL = os.Getenv("ALCHEMY_WS")
	if rpcURL == "" {
		rpcURL = os.Getenv("ETH_RPC")
	}
	if rpcURL == "" {
		log.Fatal("set ALCHEMY_WS (or ETH_RPC) env var to point to Sepolia RPC (wss recommended)")
	}
	ca := os.Getenv("CONTRACT_ADDR")
	if ca == "" {
		log.Fatal("set CONTRACT_ADDR environment variable (the deployed ToDo contract address)")
	}
	contractAddr = common.HexToAddress(ca)

	dbURL = os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("set DB_URL environment variable for Postgres, e.g. postgres://user:pass@localhost:5432/db?sslmode=disable")
	}

	privateKey = os.Getenv("PRIVATE_KEY")
}

func main() {
	ctx := context.Background()

	// Parse ABI
	var err error
	abiObj, err := abi.JSON(strings.NewReader(contracts.ToDoABI))
	if err != nil {
		log.Fatalf("invalid ABI: %v", err)
	}
	parsedABI = &abiObj

	// Connect to Ethereum (ws or http)
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		log.Fatalf("ethclient.Dial error: %v", err)
	}
	defer client.Close()
	log.Println("connected to Ethereum RPC:", rpcURL)

	// Connect to Postgres
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("db open error: %v", err)
	}
	defer db.Close()

	// Ensure DB reachable
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("db ping error: %v", err)
	}
	log.Println("connected to Postgres")

	// Bound contract (for call + transact)
	contract := bind.NewBoundContract(contractAddr, *parsedABI, client, client, client)

	// Start event listener (background) - only if using WebSocket
	if strings.HasPrefix(rpcURL, "wss://") || strings.HasPrefix(rpcURL, "ws://") {
		go startEventListener(ctx, client, db)
	} else {
		log.Println("HTTP RPC detected - event listening disabled. Use WebSocket (wss://) for real-time events.")
	}

	// Start HTTP server for APIs (create task / read tasks / update status / events from DB)
	http.HandleFunc("/createTask", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST only", http.StatusMethodNotAllowed)
			return
		}
		var body struct {
			AssignedTo  string `json:"assignedTo"`
			Description string `json:"description"`
			Date        uint32 `json:"date"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "bad body: "+err.Error(), http.StatusBadRequest)
			return
		}
		txHash, err := createTaskTx(ctx, client, contract, body.AssignedTo, body.Description, body.Date)
		if err != nil {
			http.Error(w, "createTask error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
	})

	http.HandleFunc("/getActiveTasks", func(w http.ResponseWriter, r *http.Request) {
		// simple call to contract.getActiveTasks()
		var result []interface{}
		callOpts := &bind.CallOpts{Context: ctx}
		err := contract.Call(callOpts, &result, "getActiveTasks")
		if err != nil {
			http.Error(w, "call error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Convert result to tasks
		tasks := make([]Task, 0, len(result))
		for _, res := range result {
			if task, ok := interfaceToTask(res); ok {
				tasks = append(tasks, task)
			}
		}

		out := make([]map[string]interface{}, 0, len(tasks))
		for _, t := range tasks {
			out = append(out, taskToMap(t))
		}
		json.NewEncoder(w).Encode(out)
	})

	// Simple endpoint to read recent stored events in Postgres
	http.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.QueryContext(ctx, `SELECT id, event_name, event_data, block_number, tx_hash, created_at FROM todo_events ORDER BY id DESC LIMIT 100`)
		if err != nil {
			http.Error(w, "db query: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		type rowOut struct {
			ID          int             `json:"id"`
			EventName   string          `json:"event_name"`
			EventData   json.RawMessage `json:"event_data"`
			BlockNumber int64           `json:"block_number"`
			TxHash      string          `json:"tx_hash"`
			CreatedAt   time.Time       `json:"created_at"`
		}
		var out []rowOut
		for rows.Next() {
			var rrow rowOut
			var ev json.RawMessage
			if err := rows.Scan(&rrow.ID, &rrow.EventName, &ev, &rrow.BlockNumber, &rrow.TxHash, &rrow.CreatedAt); err != nil {
				http.Error(w, "scan: "+err.Error(), http.StatusInternalServerError)
				return
			}
			rrow.EventData = ev
			out = append(out, rrow)
		}
		json.NewEncoder(w).Encode(out)
	})

	// Start server in goroutine
	srv := &http.Server{Addr: ":8080"}

	go func() {
		log.Println("HTTP API listening on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("http server error: %v", err)
		}
	}()

	// Wait for interrupt and shutdown gracefully
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop
	log.Println("shutting down...")
	ctxShutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctxShutdown)
}

// -----------------------
// createTaskTx: send createTask transaction
// -----------------------
func createTaskTx(ctx context.Context, client *ethclient.Client, contract *bind.BoundContract, assignedToHex, description string, date uint32) (string, error) {
	if privateKey == "" {
		return "", fmt.Errorf("no PRIVATE_KEY set; set env PRIVATE_KEY to send transactions")
	}
	priv, err := cryptoHexToECDSA(privateKey)
	if err != nil {
		return "", err
	}

	chainID, err := client.NetworkID(ctx)
	if err != nil {
		return "", err
	}
	auth, err := bind.NewKeyedTransactorWithChainID(priv, chainID)
	if err != nil {
		return "", err
	}

	// Suggest gas price
	gp, err := client.SuggestGasPrice(ctx)
	if err == nil {
		auth.GasPrice = gp
	}
	auth.GasLimit = uint64(400000) // ok for createTask but adjust if needed

	to := common.HexToAddress(assignedToHex)

	tx, err := contract.Transact(auth, "createTask", to, description, date)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// -----------------------
// event listener: subscribe to logs and insert into Postgres
// -----------------------
func startEventListener(ctx context.Context, client *ethclient.Client, db *sql.DB) {
	// Precompute mapping of topic ID -> event name
	eventMap := map[common.Hash]string{}
	for name, ev := range parsedABI.Events {
		eventMap[ev.ID] = name
	}

	query := ethereum.FilterQuery{
		Addresses: []common.Address{contractAddr},
	}

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(ctx, query, logs)
	if err != nil {
		log.Fatalf("SubscribeFilterLogs error: %v", err)
	}
	log.Println("event listener subscribed for contract:", contractAddr.Hex())

	for {
		select {
		case err := <-sub.Err():
			log.Printf("subscription error: %v", err)
			// exit - in production you should reconnect with backoff
			return
		case vLog := <-logs:
			handleLog(ctx, db, vLog, eventMap)
		}
	}
}

func handleLog(ctx context.Context, db *sql.DB, vLog types.Log, eventMap map[common.Hash]string) {
	ename, ok := eventMap[vLog.Topics[0]]
	if !ok {
		log.Printf("unknown event topic: %s", vLog.Topics[0].Hex())
		return
	}
	// decode non-indexed args into map
	decoded := map[string]interface{}{}
	if err := parsedABI.UnpackIntoMap(decoded, ename, vLog.Data); err != nil {
		// UnpackIntoMap returns error for some types sometimes; still continue
		log.Printf("UnpackIntoMap err for %s: %v", ename, err)
	}

	// decode indexed topics
	ev := parsedABI.Events[ename]
	topicIdx := 1
	for i := 0; i < len(ev.Inputs); i++ {
		in := ev.Inputs[i]
		if in.Indexed {
			if topicIdx >= len(vLog.Topics) {
				decoded[in.Name] = nil
			} else {
				t := vLog.Topics[topicIdx]
				switch in.Type.T {
				case abi.AddressTy:
					decoded[in.Name] = common.HexToAddress(t.Hex()).Hex()
				case abi.UintTy, abi.IntTy:
					// big int
					val := new(big.Int).SetBytes(t.Bytes())
					decoded[in.Name] = val.String()
				default:
					decoded[in.Name] = t.Hex()
				}
			}
			topicIdx++
		}
	}

	// Final JSON
	jb, err := json.Marshal(decoded)
	if err != nil {
		log.Printf("json marshal err: %v", err)
		return
	}

	// insert into DB
	_, err = db.ExecContext(ctx, `INSERT INTO todo_events (event_name, event_data, block_number, tx_hash) VALUES ($1,$2,$3,$4)`,
		ename, string(jb), vLog.BlockNumber, vLog.TxHash.Hex())
	if err != nil {
		log.Printf("db insert err: %v", err)
		return
	}
	log.Printf("stored event %s tx=%s blk=%d data=%s", ename, vLog.TxHash.Hex(), vLog.BlockNumber, string(jb))
}

// -----------------------
// small helper: parse private key without importing crypto directly in many places
// -----------------------
func cryptoHexToECDSA(hexkey string) (*ecdsa.PrivateKey, error) {
	// we import crypto packages locally to avoid naming conflicts
	// this function sits here to centralize error messaging
	priv, err := crypto.HexToECDSA(hexkey)
	if err != nil {
		return nil, fmt.Errorf("private key parse error: %v", err)
	}
	return priv, nil
}
