package main

import (
	"context"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum/ethclient"
)

var AlchemyURL = "wss://eth-sepolia.g.alchemy.com/v2/9IwQAcxSs0x9f5LGTnz3czk5iW_mf8Bo"
var GanacheURL = "http://127.0.0.1:8545"

func main() {
	client, err := ethclient.Dial(AlchemyURL)
	if err != nil {
		log.Fatalf("Error connecting to the Ethereum client:%v", err)
	}

	defer client.Close()

	block, err := client.BlockByNumber(context.Background(), nil)
	if err != nil {
		log.Fatalf("Error getting block by number:%v", err)
	}

	fmt.Println(block.Number())
	fmt.Println(client)
	_ = client
}
