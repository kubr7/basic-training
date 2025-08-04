package main

import (
	"fmt"
	"time"
)

func main() {
	// Timer: single shot
	timer := time.NewTimer(2 * time.Second)
	go func() {
		<-timer.C
		fmt.Println("Timer fired!")
	}()

	// Ticker: periodic
	ticker := time.NewTicker(1 * time.Second)
	go func() {
		for t := range ticker.C {
			fmt.Println("Tick at", t)
		}
	}()

	time.Sleep(5 * time.Second)
	ticker.Stop()
	fmt.Println("Ticker stopped")
}
