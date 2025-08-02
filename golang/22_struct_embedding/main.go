package main

import "fmt"

type runs struct {
	num int
}

func (r runs) describe() string {
	return fmt.Sprintf("Runs:%v", r.num)
}

type Player struct {
	runs
	name string
}

func main() {

	co := Player{
		runs: runs{
			num: 95,
		},
		name: "Jethalal Gada",
	}

	fmt.Printf("Player: Name: %v, Runs: %v\n", co.name, co.num)

	fmt.Println("Runs:", co.runs.num)

	fmt.Println("Runs from describe:", co.describe())

	type describer interface {
		describe() string
	}

	var d describer = co
	fmt.Println("Runs from describer:", d.describe())
}
