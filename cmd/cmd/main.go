package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"

	"github.com/btcsuite/btcutil/base58"
	v8 "rogchap.com/v8go"
)

func errHandle(e error) {
	if e != nil {
		fmt.Printf("e: %v\n", e)
	}
}

type themePair struct {
	Background string `json:"background"`
	Foreground string `json:"foreground"`
}

func toThemePair(v *v8.Value) (dest *themePair) {
	objB, _ := v.Object().MarshalJSON()

	errHandle(json.Unmarshal(objB, &dest))

	return dest
}

func confStr(config *Config) string {
	c, _ := json.Marshal(config)
	return string(c)
}

type Config struct {
	Theme   *themePair `json:"theme"`
	Font    string     `json:"font"`
	GuiMode string     `json:"guiMode"`
}

func main() {
	var config *Config = &Config{}

	iso, _ := v8.NewIsolate() // create a new VM
	// a template that represents a JS function
	printfn, _ := v8.NewFunctionTemplate(iso, func(info *v8.FunctionCallbackInfo) *v8.Value {
		for _, arg := range info.Args() {
			fmt.Printf("%v ", arg)
		}
		fmt.Println()
		return nil
	})

	setThemefn, _ := v8.NewFunctionTemplate(iso, func(info *v8.FunctionCallbackInfo) *v8.Value {
		arg := info.Args()[0]
		if arg.IsObject() {
			var theme *themePair = toThemePair(arg)
			config.Theme = theme
		} else {
			fmt.Println("e: Expected object with values background and foreground")
			fmt.Printf("\t- %v\n", arg)
		}
		return nil
	})

	global, _ := v8.NewObjectTemplate(iso)
	global.Set("print", printfn)
	global.Set("set_theme", setThemefn)
	ctx, _ := v8.NewContext(iso, global)

	conf, err := os.ReadFile("./conf.zc")
	errHandle(err)
	content := string(conf)

	_, err = ctx.RunScript(content, "index.js") // will execute the Go callback with a single argunent 'foo'
	errHandle(err)

	encoded := base58.Encode([]byte(confStr(config)))
	cmd := exec.Command("tauri", "dev", "--", "-C", encoded)
	fmt.Println(cmd.Args)
	cmd.Run()
}
