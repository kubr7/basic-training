package main

import "fmt"

func main() {
	r1 := 'A'
	r2 := '*'
	r3 := '😀'
	fmt.Printf("%c %U\n", r1, r1)
	fmt.Printf("%c %U\n", r2, r2)
	fmt.Printf("%c %U\n", r3, r3)

	s := "Hi😀"
	fmt.Println(len(s))
	fmt.Println([]rune(s))
	fmt.Println(len([]rune(s)))
}

// package main

// import (
// 	"fmt"
// 	"unicode/utf8"
// )

// func main() {

// 	const s = "สวัสดี"

// 	fmt.Println("Len:", len(s))

// 	for i := 0; i < len(s); i++ {
// 		fmt.Printf("%x ", s[i])
// 	}
// 	fmt.Println()

// 	fmt.Println("Rune count:", utf8.RuneCountInString(s))

// 	for idx, runeValue := range s {
// 		fmt.Printf("%#U starts at %d\n", runeValue, idx)
// 	}

// 	fmt.Println("\nUsing DecodeRuneInString")
// 	for i, w := 0, 0; i < len(s); i += w {
// 		runeValue, width := utf8.DecodeRuneInString(s[i:])
// 		fmt.Printf("%#U starts at %d\n", runeValue, i)
// 		w = width

// 		examineRune(runeValue)
// 	}
// }

// func examineRune(r rune) {

// 	switch r {
// 	case 't':
// 		fmt.Println("found tee")
// 	case 'ส':
// 		fmt.Println("found so sua")
// 	}
// }

// package main

// import "fmt"

// func main() {

// 	i := 1
// 	for i <= 3 {
// 		fmt.Println(i)
// 		i = i + 1
// 	}

// 	for j := 0; j < 3; j++ {
// 		fmt.Println(j)
// 	}

// 	for i := range 3 {
// 		fmt.Println("range", i)
// 	}

// 	for {
// 		fmt.Println("loop")
// 		break
// 	}

// 	for n := range 6 {
// 		if n%2 == 0 {
// 			continue
// 		}
// 		fmt.Println(n)
// 	}
// }
