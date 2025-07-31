package main

import (
	"fmt"

	"slices"
)

func main() {

	var s []string
	fmt.Println("uninit:", s, s == nil, len(s) == 0)

	s = make([]string, 3)
	fmt.Println("empty:", s, "length:", len(s), "capacity:", cap(s))

	s[0] = "a"
	s[1] = "b"
	s[2] = "c"
	fmt.Println("set:", s)
	fmt.Println("get:", s[2])

	fmt.Println("length:", len(s))

	s = append(s, "d")
	s = append(s, "e", "f")
	fmt.Println("append:", s)

	c := make([]string, len(s))
	copy(c, s)
	fmt.Println("copy:", c)

	l := s[2:5]
	fmt.Println("slice 1:", l)

	l = s[:5]
	fmt.Println("slice 2:", l)

	l = s[2:]
	fmt.Println("slice 3:", l)

	t := []string{"g", "h", "i"}
	fmt.Println("declare:", t)

	t2 := []string{"g", "h", "i"}
	if slices.Equal(t, t2) {
		fmt.Println("t == t2")
	}
}
