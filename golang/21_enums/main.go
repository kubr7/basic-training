package main

import "fmt"

type State int

const (
	Start State = iota
	Lunch
	TeaBreak
	Stumps
)

func (state State) String() string {
	return []string{"Start", "Lunch", "TeaBreak", "Stumps"}[state]
}

// Alternative way to do it - using a map
// var stateName = map[State]string{
// 	Start:    "Start",
// 	Lunch:    "Lunch",
// 	TeaBreak: "TeaBreak",
// 	Stumps:   "Stumps",
// }

// func (state State) String() string {
// 	return stateName[state]
// }

// // Hard-coded String() without map
// func (state State) String() string {
// 	switch state {
// 	case Start:
// 		return "Start"
// 	case Lunch:
// 		return "Lunch"
// 	case TeaBreak:
// 		return "TeaBreak"
// 	case Stumps:
// 		return "Stumps"
// 	default:
// 		return "Unknown"
// 	}
// }

func transition(state State) State {
	switch state {
	case Start:
		return Lunch
	case Lunch:
		return TeaBreak
	case TeaBreak:
		return Stumps
	case Stumps:
		return Start
	default:
		panic(fmt.Errorf("unknown state: %d", state))
	}
}

func main() {
	start := transition(Start)
	fmt.Println(start)

	lunch := transition(Lunch)
	fmt.Println(lunch)

	teaBreak := transition(TeaBreak)
	fmt.Println(teaBreak)

	stumps := transition(Stumps)
	fmt.Println(stumps)
}
