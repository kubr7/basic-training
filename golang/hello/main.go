package main

import (
	"fmt"
	"log"

	"greetings"
)

func main() {
	log.SetPrefix("greetings: ")
	log.SetFlags(0)

	result, err := greetings.Hello("Seven")

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(result)
}
