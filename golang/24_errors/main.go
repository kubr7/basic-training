package main

import (
	"errors"
	"fmt"
)

var (
	ErrPlayerNotFound = errors.New("player not found")
	ErrPlayerBanned   = errors.New("player is banned")
)

type Player struct {
	ID     int
	Name   string
	Banned bool
}

var players = []Player{
	{ID: 1, Name: "Virat Kohli", Banned: false},
	{ID: 2, Name: "Rohit Sharma", Banned: true},
}

func GetPlayer(id int) (Player, error) {
	for _, p := range players {
		if p.ID == id {
			if p.Banned {
				return Player{}, fmt.Errorf("cannot load player %d: %w", id, ErrPlayerBanned)
			}
			return p, nil
		}
	}
	return Player{}, ErrPlayerNotFound
}

func main() {
	for _, id := range []int{1, 2, 3} {
		p, err := GetPlayer(id)
		if err != nil {
			if errors.Is(err, ErrPlayerNotFound) {
				fmt.Printf("Error: Player with ID %d does not exist.\n", id)
			} else if errors.Is(err, ErrPlayerBanned) {
				fmt.Printf("Error: Player with ID %d is banned.\n", id)
			} else {
				fmt.Printf("Unknown error: %s\n", err)
			}
			continue
		}
		fmt.Printf("Welcome, %s (ID: %d)\n", p.Name, p.ID)
	}
}
