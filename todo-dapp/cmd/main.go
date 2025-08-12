package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	_ "github.com/lib/pq"

	"github.com/kubr7/todo-dapp/internal/config"
	"github.com/kubr7/todo-dapp/internal/handlers"
	"github.com/kubr7/todo-dapp/internal/routes"
	"github.com/kubr7/todo-dapp/internal/services"
)

func main() {
	ctx := context.Background()

	// Load configuration
	cfg := config.Load()
	log.Println("configuration loaded successfully")

	// Connect to Postgres
	db, err := sql.Open("postgres", cfg.DBURL)
	if err != nil {
		log.Fatalf("db open error: %v", err)
	}
	defer db.Close()

	// Ensure DB reachable
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("db ping error: %v", err)
	}
	log.Println("connected to Postgres")

	// Initialize blockchain service
	blockchainService, err := services.NewBlockchainService(cfg.RPCURL, cfg.ContractAddr, cfg.PrivateKey)
	if err != nil {
		log.Fatalf("failed to initialize blockchain service: %v", err)
	}
	defer blockchainService.Close()
	log.Println("connected to Ethereum RPC:", cfg.RPCURL)

	// Start event listener (background) - only if using WebSocket
	if isWebSocketURL(cfg.RPCURL) {
		go blockchainService.StartEventListener(ctx, db)
	} else {
		log.Println("HTTP RPC detected - event listening disabled. Use WebSocket (wss://) for real-time events.")
	}

	// Initialize handlers
	taskHandler := handlers.NewTaskHandler(blockchainService, db)

	// Setup routes
	routes.SetupRoutes(taskHandler)

	// Start server in goroutine
	srv := &http.Server{Addr: cfg.ServerPort}

	go func() {
		log.Printf("HTTP API listening on %s", cfg.ServerPort)
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

// isWebSocketURL checks if the URL is a WebSocket URL
func isWebSocketURL(url string) bool {
	return strings.HasPrefix(url, "wss://") || strings.HasPrefix(url, "ws://")
}
