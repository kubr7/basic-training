package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("Hello, ToDo!")

	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: Error loading .env file: %v", err)
	}

	eth_rpc := os.Getenv("ETH_RPC")
	if eth_rpc == "" {
		log.Fatal("ETH_RPC environment variable is not set")
	}
	contractAddr := os.Getenv("TODO_CONTRACT_ADDR")
	if contractAddr == "" {
		log.Fatal("TODO_CONTRACT_ADDR environment variable is not set")
	}

	fmt.Printf("Using Ethereum RPC: %s\n", eth_rpc)
	fmt.Printf("Using Contract Address: %s\n", contractAddr)
}
