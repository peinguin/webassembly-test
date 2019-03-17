package main

import (
	"regexp"
	"syscall/js"
	"strings"
)

const str = "[dfsf]vcs [sfdfds]";
var done = make(chan struct{})

func main() {
	//re1 := regexp.MustCompile(`\[([^\]]*)\]`)
	re1 := regexp.MustCompile(`\[([^\]]*?)\]`)

	var internalRegexp js.Func
	defer internalRegexp.Release()
	internalRegexp = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		for i := 0; i < 10000; i++ {
			re1.FindAllString(str, -1);
		}
		return nil
	})
	js.Global().Set("runInternalWasm", internalRegexp)

	var regexp js.Func
	defer regexp.Release()
	regexp = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return strings.Join(re1.FindAllString(args[0].String(), -1), "|")
	})
	js.Global().Set("runWasm", regexp)

	<-done
}
