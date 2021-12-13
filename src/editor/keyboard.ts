import hotkey from "hotkeys-js";
import { Extension } from "@tiptap/core";
import type { EditorMain } from "./editor";
import { createWindow } from "./wm/main";
import { lastHead, size as globalSize } from "../components/store";

hotkey.filter = () => {
    return true;
};
hotkey("ctrl+p", () => {
    createWindow("cmd", import("../components/std/cmd.svelte"), false);
});

export const keyboard = Extension.create({
    onCreate() {
        document.body.addEventListener("keydown", (e) => {
            if (e.key == "Tab") {
                e.preventDefault();
            }
        });
    },
    addKeyboardShortcuts(): any {
        return {
            Tab: ({ editor }: { editor: EditorMain }) => {
                const transaction = editor.state.tr.insertText("\t");
                editor.view.dispatch(transaction);
                editor.commands.focus();
            },
            Enter: ({ editor }: { editor: EditorMain }) => {
                lastHead.subscribe((e) => {
                    if (e) {
                        globalSize.update(() => {
                            return {
                                label: `12`,
                                value: `12pt`,
                                transform: true,
                            };
                        });
                        lastHead.set(false);
                    } else {
                        const size = editor.getAttributes("textStyle").size;
                        globalSize.update(() => {
                            return {
                                label: `${size.replace("pt", "")}`,
                                value: `${size}`,
                                transform: true,
                            };
                        });
                    }
                });
            },
            "Ctrl-Shift-f": ({ editor }: { editor: EditorMain }) => {
                if (editor.getAttributes("textStyle").size) {
                    let size = parseInt(
                        editor.getAttributes("textStyle").size.split("pt")[0]
                    );
                    size--;
                    globalSize.update(() => {
                        return {
                            label: `${size}`,
                            value: `${size}pt`,
                            transform: true,
                        };
                    });
                } else {
                    let size = 16;
                    size++;
                    globalSize.update(() => {
                        return {
                            label: `${size}`,
                            value: `${size}pt`,
                            transform: true,
                        };
                    });
                }
            },
            "Ctrl-f": ({ editor }: { editor: EditorMain }) => {
                if (editor.getAttributes("textStyle").size) {
                    let size = parseInt(
                        editor.getAttributes("textStyle").size.split("pt")[0]
                    );
                    size++;
                    globalSize.update(() => {
                        return {
                            label: `${size}`,
                            value: `${size}pt`,
                            transform: true,
                        };
                    });
                    //editor.commands.setFontSize(`${size}px`);
                } else {
                    let size = 16;
                    size++;
                    globalSize.update(() => {
                        return {
                            label: `${size}`,
                            value: `${size}pt`,
                            transform: true,
                        };
                    });
                }
            },
        };
    },
});
