// internal/config/config.go
package config

import (
	"log"
	"os"

	"github.com/ethereum/go-ethereum/common"
)

type Config struct {
	RPCURL       string
	ContractAddr common.Address
	DatabaseURL  string
	PrivateKey   string
	Port         string
	GinMode      string
}

func Load() *Config {
	return &Config{
		RPCURL:       getEnv("ETHEREUM_RPC", ""),
		ContractAddr: common.HexToAddress(getEnv("CONTRACT_ADDR", "")),
		DatabaseURL:  getEnv("DB_URL", ""),
		PrivateKey:   getEnv("PRIVATE_KEY", ""),
		Port:         getEnv("PORT", "8080"),
		GinMode:      getEnv("GIN_MODE", "debug"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	if defaultValue == "" {
		log.Fatalf("Environment variable %s is required", key)
	}
	return defaultValue
}
