package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("Hello, GO")

	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: Error loading .env file: %v", err)
	}

	eth_rpc := os.Getenv("RPC_ETH")
	if eth_rpc == "" {
		log.Fatal("RPC_ETH environment variable is not set")
	}
	contractAddr := os.Getenv("CONTRACT_ADDR")
	if contractAddr == "" {
		log.Fatal("CONTRACT_ADDR environment variable is not set")
	}

	fmt.Printf("Using Ethereum RPC: %s\n", eth_rpc)
	fmt.Printf("Using Contract Address: %s\n", contractAddr)
}
