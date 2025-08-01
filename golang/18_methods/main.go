package main

import "fmt"

type rect struct {
	width, height int
}

func (radius *rect) area() int {
	return radius.width * radius.height
}

func (radius rect) perim() int {
	return 2*radius.width + 2*radius.height
}

// Pointer receiver: actually modifies width & height
func (radius *rect) resize(newW, newH int) {
	radius.width = newW
	radius.height = newH
}

func main() {
	result := rect{width: 10, height: 6}

	// Pointer receiver on value (Go auto &result)
	fmt.Println("area: ", result.area())
	// Value receiver on value
	fmt.Println("perim:", result.perim())

	fmt.Println("--------------------------------")

	// Another rect value
	res := rect{width: 10, height: 10}
	fmt.Println("\narea: ", res.area())
	fmt.Println("perim:", res.perim())

	// Pointer to existing rect
	resultPtr := &result
	fmt.Println("\narea: ", resultPtr.area())
	fmt.Println("perim:", resultPtr.perim())

	// Pointer to new rect
	resPtr := &rect{width: 15, height: 15}
	fmt.Println("\narea: ", resPtr.area())
	fmt.Println("perim:", resPtr.perim())

	// ***NEW: Call method to modify original rect via pointer***
	resPtr.resize(20, 30) // change width and height
	fmt.Println("\nAfter resize -> area:", resPtr.area(), "perim:", resPtr.perim())
}
