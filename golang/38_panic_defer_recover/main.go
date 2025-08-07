package main

import "fmt"

func risky() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered:", r)
		}
	}()
	defer fmt.Println("Cleanup before crash")

	fmt.Println("Doing risky work")
	panic("Disk error!")
	// fmt.Println("This won't run")
}

func main() {
	risky()
	fmt.Println("Program still running")
}
