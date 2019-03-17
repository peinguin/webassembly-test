package main

import (
	"regexp"
	"syscall/js"
	"strings"
)

const str = "[dfsf]vcs [sfdfds]";
var done = make(chan struct{})

func main() {
	re1 := regexp.MustCompile(`\[([^\]]*)\]`)
	//re1 := regexp.MustCompile(`\[([^\]]*?)\]`)

	var regexp js.Func
	defer regexp.Release()
	regexp = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return strings.Join(re1.FindAllString(args[0].String(), -1), "|")
	})
	js.Global().Set("runWasm", regexp)

	<-done
}
