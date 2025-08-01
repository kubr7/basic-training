package main

import (
	"fmt"
	"maps"
)

func main() {

	m := make(map[string]int)

	m["key1"] = 7
	m["key2"] = 13

	fmt.Println("map:", m)

	v1 := m["key1"]
	fmt.Println("value 1:", v1)

	v3 := m["key3"]
	fmt.Println("value 3:", v3)

	fmt.Println("length:", len(m))

	delete(m, "key2")
	fmt.Println("map:", m)

	clear(m)
	fmt.Println("map:", m)

	_, prs := m["key2"]
	fmt.Println("present:", prs)

	n := map[string]int{"M": 1, "N": 2}
	fmt.Println("map:", n)

	n2 := map[string]int{"M": 1, "N": 2}
	if maps.Equal(n, n2) {
		fmt.Println("n == n2")
	}
}
