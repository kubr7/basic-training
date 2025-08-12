// internal/services/services.go
package services

import (
	"context"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/yourname/todo-dapp/contract"
	"github.com/yourname/todo-dapp/internal/config"
)

type BlockchainService struct {
	client     *ethclient.Client
	contract   *contract.Contract
	privateKey string
}

func NewBlockchainService(cfg *config.Config) (*BlockchainService, error) {
	client, err := ethclient.Dial(cfg.RPCURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Ethereum: %w", err)
	}

	todoContract, err := contract.NewContract(cfg.ContractAddr, client)
	if err != nil {
		return nil, fmt.Errorf("failed to create contract instance: %w", err)
	}

	return &BlockchainService{
		client:     client,
		contract:   todoContract,
		privateKey: cfg.PrivateKey,
	}, nil
}

func (s *BlockchainService) CreateTask(ctx context.Context, assignedTo, description string, date uint32) (string, error) {
	auth, err := s.getAuth(ctx)
	if err != nil {
		return "", err
	}

	to := common.HexToAddress(assignedTo)
	tx, err := s.contract.CreateTask(auth, to, description, date)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) DeleteTask(ctx context.Context, taskId string) (string, error) {
	auth, err := s.getAuth(ctx)
	if err != nil {
		return "", err
	}

	taskIdBigInt := new(big.Int)
	taskIdBigInt.SetString(taskId, 10)

	tx, err := s.contract.DeleteTask(auth, taskIdBigInt)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) ModifyTask(ctx context.Context, taskId, newDescription string, newDate uint32) (string, error) {
	auth, err := s.getAuth(ctx)
	if err != nil {
		return "", err
	}

	taskIdBigInt := new(big.Int)
	taskIdBigInt.SetString(taskId, 10)

	tx, err := s.contract.ModifyTask(auth, taskIdBigInt, newDescription, newDate)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) UpdateTaskStatus(ctx context.Context, taskId string, newStatus uint8) (string, error) {
	auth, err := s.getAuth(ctx)
	if err != nil {
		return "", err
	}

	taskIdBigInt := new(big.Int)
	taskIdBigInt.SetString(taskId, 10)

	tx, err := s.contract.UpdateTaskStatus(auth, taskIdBigInt, newStatus)
	if err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

func (s *BlockchainService) GetActiveTasks(ctx context.Context) ([]map[string]interface{}, error) {
	callOpts := &bind.CallOpts{Context: ctx}
	tasks, err := s.contract.GetActiveTasks(callOpts)
	if err != nil {
		return nil, err
	}

	result := make([]map[string]interface{}, 0, len(tasks))
	for _, task := range tasks {
		result = append(result, map[string]interface{}{
			"id":          task.Id.String(),
			"creator":     task.Creator.Hex(),
			"assignedTo":  task.AssignedTo.Hex(),
			"description": task.Description,
			"date":        task.Date,
			"status":      task.Status,
			"isDeleted":   task.IsDeleted,
			"isModified":  task.IsModified,
		})
	}
	return result, nil
}

func (s *BlockchainService) getAuth(ctx context.Context) (*bind.TransactOpts, error) {
	if s.privateKey == "" {
		return nil, fmt.Errorf("no private key configured")
	}

	priv, err := crypto.HexToECDSA(s.privateKey)
	if err != nil {
		return nil, err
	}

	chainID, err := s.client.NetworkID(ctx)
	if err != nil {
		return nil, err
	}

	return bind.NewKeyedTransactorWithChainID(priv, chainID)
}
