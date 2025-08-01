package main

import (
	"fmt"
)

type BatsmanData interface {
	batsmanStrikeRate() float64
}

type BowlerData interface {
	bowlerStrikeRate() float64
}

type PlayerData interface {
	BatsmanData
	BowlerData
}

type Batsman struct {
	run, balls int
}

func (batsman Batsman) batsmanStrikeRate() float64 {
	return float64(batsman.run) * 100 / float64(batsman.balls)
}

type Bowler struct {
	wickets, balls int
}

func (bowler Bowler) bowlerStrikeRate() float64 {
	return float64(bowler.balls) / float64(bowler.wickets)
}

type AllRounder struct {
	Batsman
	Bowler
}

func getBatsmanData(player BatsmanData) {
	fmt.Printf("Batsman Strike Rate: %.2f", player.batsmanStrikeRate())
	fmt.Println("\n--------------------------------")
}

func getBowlerData(player BowlerData) {
	fmt.Printf("Bowler Strike Rate: %.2f", player.bowlerStrikeRate())
	fmt.Println("\n--------------------------------")
}

func getPlayerData(player PlayerData) {
	fmt.Printf("Batsman Strike Rate: %.2f\n", player.batsmanStrikeRate())
	fmt.Printf("Bowler Strike Rate: %.2f\n", player.bowlerStrikeRate())
	fmt.Println("\n--------------------------------")
}

func detectBatsman(player BatsmanData) {
	if batsman, ok := player.(Batsman); ok {
		fmt.Println("Batsman detected")
		fmt.Printf("Batsman stats: %d runs, %d balls\n", batsman.run, batsman.balls)
	} else {
		fmt.Println("Batsman not detected")
	}
}

func detectBowler(player PlayerData) {
	if allRounder, ok := player.(AllRounder); ok {
		fmt.Println("AllRounder with Bowler detected")
		fmt.Printf("Bowler stats: %d wickets, %d balls\n", allRounder.Bowler.wickets, allRounder.Bowler.balls)
	} else {
		fmt.Println("Bowler not detected")
	}
}

func main() {
	batsman := Batsman{run: 100, balls: 35}
	bowler := Bowler{wickets: 4, balls: 24}

	getBatsmanData(batsman)
	getBowlerData(bowler)

	allRounder := AllRounder{Batsman: batsman, Bowler: bowler}
	getPlayerData(allRounder)
	detectBowler(allRounder)
	detectBatsman(batsman)
}
