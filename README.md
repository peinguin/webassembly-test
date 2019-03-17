To build webasm file

```
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
