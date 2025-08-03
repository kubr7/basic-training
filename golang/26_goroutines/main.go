package main

import (
	"fmt"
	"time"
)

func f(msg string) {
	for i := range 3 {
		fmt.Println(msg, ":", i)
	}
}

func main() {

	f("Synchronous")

	go f("Goroutine: Asynchronous")

	go func(msg string) {
		fmt.Println(msg)
	}("Goroutine: Anonymous Asynchronous")

	time.Sleep(time.Second)
	fmt.Println("Done")
}
