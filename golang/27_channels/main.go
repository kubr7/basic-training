package main

import "fmt"

func main() {
	// Unbuffered channel
	c1 := make(chan int)
	go func() { c1 <- 42 }() // send
	fmt.Println(<-c1)        // receive

	// Buffered channel
	c2 := make(chan string, 2)
	c2 <- "Go"
	c2 <- "Lang"
	fmt.Println(<-c2)
	fmt.Println(<-c2)
}
