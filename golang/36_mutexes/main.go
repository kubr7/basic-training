package main

import (
	"fmt"
	"sync"
)

func main() {
	var mu sync.Mutex
	count := 0

	var wg sync.WaitGroup
	wg.Add(5)

	for i := 0; i < 5; i++ {
		go func() {
			defer wg.Done()
			mu.Lock()
			count++
			mu.Unlock()
		}()
	}

	wg.Wait()
	fmt.Println("Final count:", count)
}
