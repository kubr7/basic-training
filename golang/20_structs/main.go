package main

import "fmt"

type Player struct {
	name  string
	run   int
	balls int
	fours int
	sixes int
}

func newPlayer(name string) *Player {

	p := Player{name: name}
	p.run = 9
	p.balls = 13
	p.fours = 1
	p.sixes = 0
	return &p
}

func main() {

	fmt.Println(Player{"Jaiswal", 2, 9, 0, 0})
	fmt.Println(Player{name: "Rahul", balls: 40, run: 14, fours: 1, sixes: 0})
	fmt.Println(Player{name: "Sai", balls: 108, run: 38, fours: 6, sixes: 0})
	fmt.Println(Player{name: "Gill", balls: 35, run: 21, fours: 4, sixes: 0})
	fmt.Println(newPlayer("Jadeja"))

	s := Player{name: "Nair", balls: 109, run: 50, fours: 8, sixes: 0}
	fmt.Println(s.name)

	sp := &s
	fmt.Println(sp.run)
	fmt.Println(sp.balls)
	fmt.Println(sp.fours)
	fmt.Println(sp.sixes)

	sp.run = 51
	fmt.Println(sp.run)

	dog := struct {
		name   string
		isGood bool
	}{
		"Rex",
		true,
	}
	fmt.Println(dog)
}
