import "@tiptap/extension-text-style";

import * as dialog from "@tauri-apps/api/dialog";
import * as fs from "@tauri-apps/api/fs";
import { Extension, Editor } from "@tiptap/core";
import * as pako from "pako";
import React, { useEffect } from "react";
import hotkeys from "hotkeys-js";

import { read } from "../config/conf";
import * as store from "../store/store_pb";

import { Cmd } from "./cmd";
import { createWindow } from "./wm";
import { EditorMain } from "./editor";

type SaveDialog = {
    editor: EditorMain;
};

hotkeys.filter = function(event){
  return true;
}
const bindings = {
    "ctrl+p": async (editor: EditorMain, setState: any) => {
        const conf = await read();
        createWindow(
            "command",
            <Cmd config={conf} />,
            `50%`,
            "5px",
            "50%",
            "fit-content",
            {
                border: "none",
                transform: "translate(-50%)",
                zIndex: "100000",
            }
        );
        setState("Loading...");
    },
};

const keysFunc = (setState: any) => {
    const SaveDialog = ({ editor }: SaveDialog) => {
        useEffect(() => {
            const handle = (e: KeyboardEvent) => {
                const el = e.target as HTMLInputElement;

                if (el.className == "saveDialog") {
                    if (e.key == "Enter") {
                        e.preventDefault();
                        // Trigger the button element with a click
                        let file = new (store.File.create({
                            Doc: JSON.stringify(editor.getJSON()),
                            Name: editor.title,
                        }) as any)();

                        const enc = store.File.encode(file).finish();
                        const compress = pako.gzip(enc);
                        const path = el.value + "/" + editor.title + ".zedx ";
                        fs.writeBinaryFile({
                            path: path.trim(),
                            contents: compress,
                        });
                        localStorage.setItem("path", path);
                        setState("");
                        window.document.removeEventListener("keyup", handle);
                    }
                }
            };
            window.document.addEventListener("keyup", handle);
            return () => {
                window.document.removeEventListener("keyup", handle);
            };
        });
        return <input type="text" placeholder="path" className="saveDialog" />;
    };
    const TabKey = Extension.create({
        name: "TabKey",
        addOptions() {
            return { ...this.parent?.(), keys: [] };
        },
        onCreate() {
            let editor = this.editor as EditorMain;
            hotkeys("ctrl+p", function (_, handler) {
                switch (handler.key) {
                    case "ctrl+p":
                        console.log(handler.key);
                        bindings[handler.key](editor, setState);
                        break;
                }
            });
        },
        addKeyboardShortcuts(): any {
            return {
                Tab: ({ editor }: { editor: Editor }) => {
                    const transaction = editor.state.tr.insertText("\t");
                    editor.view.dispatch(transaction);
                },
                Enter: ({ editor }: { editor: Editor }) => {
                    editor.commands.updateAttributes("textStyle", { size: 16 });
                },
                "Mod-f": ({ editor }: { editor: Editor }) => {
                    editor.state.tr.insertText("\t");
                    if (editor.getAttributes("textStyle").size) {
                        let size = parseInt(
                            editor
                                .getAttributes("textStyle")
                                .size.split("px")[0]
                        );
                        size++;
                        //@ts-ignore
                        editor.commands.setFontSize(`${size}px`);
                    } else {
                        let size = 16;
                        size++;
                        //@ts-ignore
                        editor.commands.setFontSize(`${size}px`);
                    }
                },
                "Mod-Shift-f": ({ editor }: { editor: Editor }) => {
                    editor.state.tr.insertText("\t");
                    if (editor.getAttributes("textStyle").size) {
                        let size = parseInt(
                            editor
                                .getAttributes("textStyle")
                                .size.split("px")[0]
                        );
                        size--;
                        //@ts-ignore
                        editor.commands.setFontSize(`${size}px`);
                    } else {
                        let size = 16;
                        size++;
                        //@ts-ignore
                        editor.commands.setFontSize(`${size}px`);
                    }
                },
                "Alt-f": ({ editor }: { editor: Editor }) => {
                    //@ts-ignore
                    editor.commands.setFontSize(`16px`);
                },
                "Mod-h": ({ editor }: { editor: Editor }) => {
                    //@ts-ignore
                    editor.commands.setFontSize(`32px`);
                },
                "Mod-s": async ({ editor }: { editor: EditorMain }) => {
                    const conf = await read();
                    if (conf.guiMode == "graphic") {
                        setState("Saving...");

                        let file = store.File.create({
                            Doc: JSON.stringify(editor.getJSON()),
                            Name: editor.title,
                        });

                        const enc = store.File.encode(file).finish();
                        const compress = pako.gzip(enc);
                        const path = await dialog.open({ directory: true });
                        const name = path + "/" + editor.title + ".zedx ";
                        fs.writeBinaryFile({
                            path: name.trim(),
                            contents: compress,
                        });
                        localStorage.setItem("path", name);
                    } else {
                        setState(<SaveDialog editor={editor} />);
                    }
                },
                //"Mod-p": async () => {
                //   const conf = await read();
                //  createWindow(
                //     "command",
                //    <Cmd config={conf} />,
                //   `50%`,
                //   "5px",
                //   "50%",
                //   "fit-content",
                //   {
                //       border: "none",
                //       transform: "translate(-50%)",
                //       zIndex: "100000",
                //   }
                //);
                //setState("Loading...");
                //},
            };
        },
    });
    return TabKey;
};
export default keysFunc;
