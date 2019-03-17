To build webasm file

```
	$ cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .
	$ GOOS=js GOARCH=wasm go build -o regexp.wasm regexp.go
```

Run on node
```
	$ node index.js
```

Or browser
```
	$ http-server
```
