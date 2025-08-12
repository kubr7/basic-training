package services

import (
	"context"
	"crypto/ecdsa"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	contract "github.com/kubr7/todo-dapp/contract"
)

// BlockchainService handles all blockchain operations
type BlockchainService struct {
	client       *ethclient.Client
	contract     *contract.Contract
	contractAddr common.Address
	privateKey   string
}

// NewBlockchainService creates a new blockchain service instance
func NewBlockchainService(rpcURL string, contractAddr common.Address, privateKey string) (*BlockchainService, error) {
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("ethclient.Dial error: %v", err)
	}

	todoContract, err := contract.NewContract(contractAddr, client)
	if err != nil {
		client.Close()
		return nil, fmt.Errorf("failed to create contract instance: %v", err)
	}

	return &BlockchainService{
		client:       client,
		contract:     todoContract,
		contractAddr: contractAddr,
		privateKey:   privateKey,
	}, nil
}

// Close closes the blockchain client connection
func (bs *BlockchainService) Close() {
	bs.client.Close()
}

// GetContract returns the contract instance
func (bs *BlockchainService) GetContract() *contract.Contract {
	return bs.contract
}

// GetClient returns the ethereum client
func (bs *BlockchainService) GetClient() *ethclient.Client {
	return bs.client
}

// CreateTaskTx sends a createTask transaction
func (bs *BlockchainService) CreateTaskTx(ctx context.Context, assignedToHex, description string, date uint32) (string, error) {
	if bs.privateKey == "" {
		return "", fmt.Errorf("no PRIVATE_KEY set; set env PRIVATE_KEY to send transactions")
	}
	
	priv, err := bs.cryptoHexToECDSA(bs.privateKey)
	if err != nil {
		return "", err
	}

	chainID, err := bs.client.NetworkID(ctx)
	if err != nil {
		return "", err
	}
	
	auth, err := bind.NewKeyedTransactorWithChainID(priv, chainID)
	if err != nil {
		return "", err
	}

	to := common.HexToAddress(assignedToHex)

	tx, err := bs.contract.CreateTask(auth, to, description, date)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// DeleteTaskTx sends a deleteTask transaction
func (bs *BlockchainService) DeleteTaskTx(ctx context.Context, taskId string) (string, error) {
	if bs.privateKey == "" {
		return "", fmt.Errorf("no PRIVATE_KEY set; set env PRIVATE_KEY to send transactions")
	}
	
	priv, err := bs.cryptoHexToECDSA(bs.privateKey)
	if err != nil {
		return "", err
	}

	chainID, err := bs.client.NetworkID(ctx)
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

	tx, err := bs.contract.DeleteTask(auth, taskIdBigInt)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// ModifyTaskTx sends a modifyTask transaction
func (bs *BlockchainService) ModifyTaskTx(ctx context.Context, taskId, newDescription string, newDate uint32) (string, error) {
	if bs.privateKey == "" {
		return "", fmt.Errorf("no PRIVATE_KEY set; set env PRIVATE_KEY to send transactions")
	}
	
	priv, err := bs.cryptoHexToECDSA(bs.privateKey)
	if err != nil {
		return "", err
	}

	chainID, err := bs.client.NetworkID(ctx)
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

	tx, err := bs.contract.ModifyTask(auth, taskIdBigInt, newDescription, newDate)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// UpdateTaskStatusTx sends an updateTaskStatus transaction
func (bs *BlockchainService) UpdateTaskStatusTx(ctx context.Context, taskId string, newStatus uint8) (string, error) {
	if bs.privateKey == "" {
		return "", fmt.Errorf("no PRIVATE_KEY set; set env PRIVATE_KEY to send transactions")
	}
	
	priv, err := bs.cryptoHexToECDSA(bs.privateKey)
	if err != nil {
		return "", err
	}

	chainID, err := bs.client.NetworkID(ctx)
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

	tx, err := bs.contract.UpdateTaskStatus(auth, taskIdBigInt, newStatus)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// StartEventListener subscribes to logs and inserts into Postgres
func (bs *BlockchainService) StartEventListener(ctx context.Context, db *sql.DB) {
	query := ethereum.FilterQuery{
		Addresses: []common.Address{bs.contractAddr},
	}

	logs := make(chan types.Log)
	sub, err := bs.client.SubscribeFilterLogs(ctx, query, logs)
	if err != nil {
		log.Fatalf("SubscribeFilterLogs error: %v", err)
	}
	log.Println("event listener subscribed for contract:", bs.contractAddr.Hex())

	for {
		select {
		case err := <-sub.Err():
			log.Printf("subscription error: %v", err)
			// exit - in production you should reconnect with backoff
			return
		case vLog := <-logs:
			bs.handleLog(ctx, db, vLog)
		}
	}
}

// TaskToMap converts ToDoContractTask to JSON-friendly map
func (bs *BlockchainService) TaskToMap(t contract.ToDoContractTask) map[string]interface{} {
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

func (bs *BlockchainService) handleLog(ctx context.Context, db *sql.DB, vLog types.Log) {
	var eventName string
	var eventData map[string]interface{}

	// Try to parse the log as each event type using the generated bindings
	// The parse methods will return an error if the log doesn't match the event signature

	if event, err := bs.contract.ParseTaskCreated(vLog); err == nil {
		eventName = "TaskCreated"
		eventData = map[string]interface{}{
			"taskId":     event.TaskId.String(),
			"creator":    event.Creator.Hex(),
			"assignedTo": event.AssignedTo.Hex(),
			"date":       event.Date,
			"status":     event.Status,
			"timestamp":  event.Timestamp.String(),
		}
	} else if event, err := bs.contract.ParseTaskDeleted(vLog); err == nil {
		eventName = "TaskDeleted"
		eventData = map[string]interface{}{
			"taskId":    event.TaskId.String(),
			"deletedBy": event.DeletedBy.Hex(),
			"timestamp": event.Timestamp.String(),
		}
	} else if event, err := bs.contract.ParseTaskModified(vLog); err == nil {
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
	} else if event, err := bs.contract.ParseTaskStatusUpdated(vLog); err == nil {
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

// cryptoHexToECDSA parses private key without importing crypto directly in many places
func (bs *BlockchainService) cryptoHexToECDSA(hexkey string) (*ecdsa.PrivateKey, error) {
	priv, err := crypto.HexToECDSA(hexkey)
	if err != nil {
		return nil, fmt.Errorf("private key parse error: %v", err)
	}
	return priv, nil
}
