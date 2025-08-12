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
	"syscall"
	"time"

	_ "github.com/lib/pq"

	contract "github.com/kubr7/todo-dapp/contract"

	"github.com/ethereum/go-ethereum"
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

	todoContract *contract.Contract
)

// utility: convert ToDoContractTask -> JSON-friendly map
func taskToMap(t contract.ToDoContractTask) map[string]interface{} {
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

	// Create typed contract instance
	todoContract, err = contract.NewContract(contractAddr, client)
	if err != nil {
		log.Fatalf("failed to create contract instance: %v", err)
	}

	// Start event listener (background) - only if using WebSocket
	if len(rpcURL) >= 6 && rpcURL[:6] == "wss://" || len(rpcURL) >= 5 && rpcURL[:5] == "ws://" {
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
		txHash, err := createTaskTx(ctx, client, body.AssignedTo, body.Description, body.Date)
		if err != nil {
			http.Error(w, "createTask error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
	})

	http.HandleFunc("/getActiveTasks", func(w http.ResponseWriter, r *http.Request) {
		// Call typed method
		callOpts := &bind.CallOpts{Context: ctx}
		tasks, err := todoContract.GetActiveTasks(callOpts)
		if err != nil {
			http.Error(w, "call error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Convert to JSON-friendly format
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

	// DELETE endpoint for deleting tasks
	http.HandleFunc("/deleteTask", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "DELETE only", http.StatusMethodNotAllowed)
			return
		}
		var body struct {
			TaskId string `json:"taskId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "bad body: "+err.Error(), http.StatusBadRequest)
			return
		}
		if body.TaskId == "" {
			http.Error(w, "taskId is required", http.StatusBadRequest)
			return
		}
		txHash, err := deleteTaskTx(ctx, client, body.TaskId)
		if err != nil {
			http.Error(w, "deleteTask error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
	})

	// PUT endpoint for modifying tasks
	http.HandleFunc("/modifyTask", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPut {
			http.Error(w, "PUT only", http.StatusMethodNotAllowed)
			return
		}
		var body struct {
			TaskId         string `json:"taskId"`
			NewDescription string `json:"newDescription"`
			NewDate        uint32 `json:"newDate"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "bad body: "+err.Error(), http.StatusBadRequest)
			return
		}
		if body.TaskId == "" {
			http.Error(w, "taskId is required", http.StatusBadRequest)
			return
		}
		if body.NewDescription == "" {
			http.Error(w, "newDescription is required", http.StatusBadRequest)
			return
		}
		txHash, err := modifyTaskTx(ctx, client, body.TaskId, body.NewDescription, body.NewDate)
		if err != nil {
			http.Error(w, "modifyTask error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
	})

	// PATCH endpoint for updating task status
	http.HandleFunc("/updateTaskStatus", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPatch {
			http.Error(w, "PATCH only", http.StatusMethodNotAllowed)
			return
		}
		var body struct {
			TaskId    string `json:"taskId"`
			NewStatus uint8  `json:"newStatus"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "bad body: "+err.Error(), http.StatusBadRequest)
			return
		}
		if body.TaskId == "" {
			http.Error(w, "taskId is required", http.StatusBadRequest)
			return
		}
		txHash, err := updateTaskStatusTx(ctx, client, body.TaskId, body.NewStatus)
		if err != nil {
			http.Error(w, "updateTaskStatus error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
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
func createTaskTx(ctx context.Context, client *ethclient.Client, assignedToHex, description string, date uint32) (string, error) {
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

	to := common.HexToAddress(assignedToHex)

	tx, err := todoContract.CreateTask(auth, to, description, date)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// -----------------------
// deleteTaskTx: send deleteTask transaction
// -----------------------
func deleteTaskTx(ctx context.Context, client *ethclient.Client, taskId string) (string, error) {
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

	// Convert taskId string to big.Int
	taskIdBigInt := new(big.Int)
	taskIdBigInt.SetString(taskId, 10)

	tx, err := todoContract.DeleteTask(auth, taskIdBigInt)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// -----------------------
// modifyTaskTx: send modifyTask transaction
// -----------------------
func modifyTaskTx(ctx context.Context, client *ethclient.Client, taskId, newDescription string, newDate uint32) (string, error) {
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

	// Convert taskId string to big.Int
	taskIdBigInt := new(big.Int)
	taskIdBigInt.SetString(taskId, 10)

	tx, err := todoContract.ModifyTask(auth, taskIdBigInt, newDescription, newDate)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// -----------------------
// updateTaskStatusTx: send updateTaskStatus transaction
// -----------------------
func updateTaskStatusTx(ctx context.Context, client *ethclient.Client, taskId string, newStatus uint8) (string, error) {
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

	// Convert taskId string to big.Int
	taskIdBigInt := new(big.Int)
	taskIdBigInt.SetString(taskId, 10)

	tx, err := todoContract.UpdateTaskStatus(auth, taskIdBigInt, newStatus)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// -----------------------
// event listener: subscribe to logs and insert into Postgres
// -----------------------
func startEventListener(ctx context.Context, client *ethclient.Client, db *sql.DB) {
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
			handleLog(ctx, db, vLog)
		}
	}
}

func handleLog(ctx context.Context, db *sql.DB, vLog types.Log) {
	var eventName string
	var eventData map[string]interface{}

	// Try to parse the log as each event type using the generated bindings
	// The parse methods will return an error if the log doesn't match the event signature

	if event, err := todoContract.ParseTaskCreated(vLog); err == nil {
		eventName = "TaskCreated"
		eventData = map[string]interface{}{
			"taskId":     event.TaskId.String(),
			"creator":    event.Creator.Hex(),
			"assignedTo": event.AssignedTo.Hex(),
			"date":       event.Date,
			"status":     event.Status,
			"timestamp":  event.Timestamp.String(),
		}
	} else if event, err := todoContract.ParseTaskDeleted(vLog); err == nil {
		eventName = "TaskDeleted"
		eventData = map[string]interface{}{
			"taskId":    event.TaskId.String(),
			"deletedBy": event.DeletedBy.Hex(),
			"timestamp": event.Timestamp.String(),
		}
	} else if event, err := todoContract.ParseTaskModified(vLog); err == nil {
		eventName = "TaskModified"
		eventData = map[string]interface{}{
			"taskId":             event.TaskId.String(),
			"modifiedBy":         event.ModifiedBy.Hex(),
			"oldDescriptionHash": common.Bytes2Hex(event.OldDescriptionHash[:]),
			"newDescriptionHash": common.Bytes2Hex(event.NewDescriptionHash[:]),
			"oldDate":            event.OldDate,
			"newDate":            event.NewDate,
			"timestamp":          event.Timestamp.String(),
		}
	} else if event, err := todoContract.ParseTaskStatusUpdated(vLog); err == nil {
		eventName = "TaskStatusUpdated"
		eventData = map[string]interface{}{
			"taskId":    event.TaskId.String(),
			"updatedBy": event.UpdatedBy.Hex(),
			"status":    event.Status,
			"timestamp": event.Timestamp.String(),
		}
	} else {
		log.Printf("unknown event - could not parse log with any known event signature")
		return
	}

	// Convert to JSON
	jb, err := json.Marshal(eventData)
	if err != nil {
		log.Printf("json marshal err: %v", err)
		return
	}

	// Insert into DB
	_, err = db.ExecContext(ctx, `INSERT INTO todo_events (event_name, event_data, block_number, tx_hash) VALUES ($1,$2,$3,$4)`,
		eventName, string(jb), vLog.BlockNumber, vLog.TxHash.Hex())
	if err != nil {
		log.Printf("db insert err: %v", err)
		return
	}
	log.Printf("stored event %s tx=%s blk=%d data=%s", eventName, vLog.TxHash.Hex(), vLog.BlockNumber, string(jb))
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
