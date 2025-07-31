package main

import "fmt"

const offset = 32
const multiplier = 1.8

func cToF(celsius float64) float64 {
	return celsius*multiplier + offset
}

func main() {
	fmt.Println(cToF(25))
}
