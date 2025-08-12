package config

import (
	"log"
	"os"

	"github.com/ethereum/go-ethereum/common"
)

// Config holds all configuration for the application
type Config struct {
	RPCURL       string
	ContractAddr common.Address
	DBURL        string
	PrivateKey   string
	ServerPort   string
}

// Load reads configuration from environment variables
func Load() *Config {
	rpcURL := os.Getenv("ALCHEMY_WS")
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
	contractAddr := common.HexToAddress(ca)

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("set DB_URL environment variable for Postgres, e.g. postgres://user:pass@localhost:5432/db?sslmode=disable")
	}

	privateKey := os.Getenv("PRIVATE_KEY")

	serverPort := os.Getenv("SERVER_PORT")
	if serverPort == "" {
		serverPort = ":8080"
	}

	return &Config{
		RPCURL:       rpcURL,
		ContractAddr: contractAddr,
		DBURL:        dbURL,
		PrivateKey:   privateKey,
		ServerPort:   serverPort,
	}
}
