package main

import "fmt"

func value(val int) {
	fmt.Printf("value received: %d\n", val)
	val = 0
}

func pointer(ptr *int) {
	fmt.Printf("pointer received: %d\n", *ptr)
	*ptr = 0
}

func main() {
	i := 1
	fmt.Println("Initial value:", i)

	value(i)
	fmt.Println("Value after function call:", i)

	pointer(&i)
	fmt.Println("Pointer after function call:", i)

	fmt.Println("Pointer after function call:", &i)
}
