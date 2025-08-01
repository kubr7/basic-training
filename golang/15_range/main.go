package main

import "fmt"

func main() {

	nums := []int{2, 3, 4}
	sum := 0
	for _, num := range nums {
		sum += num
	}
	fmt.Println("sum:", sum)

	fmt.Println("--------------------------------")

	for i, num := range nums {
		if num == 3 {
			fmt.Println("index:", i)
		}
	}

	fmt.Println("--------------------------------")

	store := map[string]int{"Apple": 1, "Banana": 2, "Cherry": 3}
	for fruit, quantity := range store {
		fmt.Printf("%s -> %d\n", fruit, quantity)
	}

	fmt.Println("--------------------------------")

	for fruit := range store {
		fmt.Println("fruit:", fruit)
	}

	fmt.Println("--------------------------------")

	for i, c := range "go" {
		fmt.Println("At index:", i, "--> Character is:", string(c))
	}
}
