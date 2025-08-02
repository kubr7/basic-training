package main

import "fmt"

// ---- Generic Linked List ----
type Node[T comparable] struct {
	val  T
	next *Node[T]
}

type LinkedList[T comparable] struct {
	head, tail *Node[T]
}

// Add new order
func (l *LinkedList[T]) Add(order T) {
	newNode := &Node[T]{val: order}
	if l.tail == nil {
		l.head = newNode
		l.tail = newNode
	} else {
		l.tail.next = newNode
		l.tail = newNode
	}
}

// Get all orders as slice
func (l *LinkedList[T]) All() []T {
	var orders []T
	for n := l.head; n != nil; n = n.next {
		orders = append(orders, n.val)
	}
	return orders
}

// Search order
func (l *LinkedList[T]) Contains(order T) bool {
	for n := l.head; n != nil; n = n.next {
		if n.val == order {
			return true
		}
	}
	return false
}

// ---- Main ----
func main() {
	// Order IDs as int
	intOrders := LinkedList[int]{}
	intOrders.Add(101)
	intOrders.Add(102)
	intOrders.Add(103)

	fmt.Println("Order IDs:", intOrders.All())
	fmt.Println("Contains 102?", intOrders.Contains(102))
	fmt.Println("Contains 200?", intOrders.Contains(200))

	// Order codes as string
	stringOrders := LinkedList[string]{}
	stringOrders.Add("ORD-AX12")
	stringOrders.Add("ORD-BY45")

	fmt.Println("\nOrder Codes:", stringOrders.All())
	fmt.Println("Contains 'ORD-AX12'?", stringOrders.Contains("ORD-AX12"))
}
