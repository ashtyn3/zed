package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"

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

type ThemeInit struct {
	Theme  *themePair `json:"theme"`
	Styles []string   `json:"styles"`
}
type CmdThemeInit struct {
	Body  []string `json:"body"`
	Input []string `json:"input"`
	Doc   []string `json:"doc"`
}
type Config struct {
	WinTheme *ThemeInit    `json:"win_theme"`
	CmdTheme *CmdThemeInit `json:"cmd_theme"`
	Font     string        `json:"font"`
}

func main() {
	var config *Config = &Config{
		WinTheme: &ThemeInit{
			Theme: &themePair{
				Background: "white",
				Foreground: "black",
			},
			Styles: []string{},
		},
		CmdTheme: &CmdThemeInit{
			Body:  []string{},
			Input: []string{},
			Doc:   []string{},
		},
		Font: "Inter",
	}

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
			config.WinTheme.Theme = theme
		} else {
			fmt.Println("e: Expected object with values background and foreground")
			fmt.Printf("\t- %v\n", arg)
		}
		prop := []string{}
		if len(info.Args()) > 1 {
			for _, s := range info.Args()[1:] {
				prop = append(prop, s.String())
			}
		}
		config.WinTheme.Styles = prop
		return nil
	})
	setCmdThemefn, _ := v8.NewFunctionTemplate(iso, func(info *v8.FunctionCallbackInfo) *v8.Value {
		cmd := &CmdThemeInit{}
		for i, arg := range info.Args() {
			tempArr := []string{}
			if arg.IsArray() {
				obj, _ := arg.AsObject()
				arrB, _ := obj.MarshalJSON()
				arr := []string{}
				json.Unmarshal(arrB, &arr)
				for _, s := range arr {
					tempArr = append(tempArr, s)
				}
			}
			switch i {
			case 0:
				cmd.Body = tempArr
			case 1:
				cmd.Doc = tempArr
			case 2:
				cmd.Input = tempArr
			}
		}
		config.CmdTheme = cmd
		return nil
	})

	global, _ := v8.NewObjectTemplate(iso)
	global.Set("print", printfn)
	global.Set("set_theme", setThemefn)
	global.Set("set_cmd_theme", setCmdThemefn)
	ctx, _ := v8.NewContext(iso, global)

	conf, err := os.ReadFile("./conf.zc")
	errHandle(err)
	content := string(conf)

	_, err = ctx.RunScript(content, "index.js") // will execute the Go callback with a single argunent 'foo'
	errHandle(err)

	encoded := base58.Encode([]byte(confStr(config)))
	//cmd := exec.Command("tauri", "dev", "--", "-C", encoded)
	cmd := exec.Command("zed", "-C", encoded)
	fmt.Println("Running zed...")
	fmt.Println(strings.Join(cmd.Args, " "))
	cmd.Run()
}
