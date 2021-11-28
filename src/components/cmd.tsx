import React, { useEffect, useRef, useState } from "react";

import { removeWindow } from "./wm";
import { Config } from "../config/conf";
import { resolve } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/api/fs";

const commander = async (
    cmd: string,
    dialog: HTMLDivElement,
    config: Config,
    set: any
) => {
    if (cmd == "r" || cmd == "reload") {
        document.location.reload();
    }
    if (cmd == "c" || cmd == "config") {
        dialog.style.setProperty("border", "1px solid black");
        set(JSON.stringify(config));
    }
    if (cmd.startsWith("o") || cmd.startsWith("open")) {
        const rawPath = cmd.split(" ")[1].trim() + ".zedx";
        const path = await resolve(rawPath);
        localStorage.setItem("path", path);
        window.location.reload();
    }
};
type Cmd = {
    config: Config;
    value?: string;
    text?: JSX.Element;
};

export const Cmd = ({ config, value, text }: Cmd) => {
    const commandPrompt = useRef() as React.MutableRefObject<HTMLInputElement>;
    const dialog = useRef<HTMLDivElement>();
    const [results, setRes] = useState(null);

    useEffect(() => {
        if (text) {
            setRes(text);
        }
    }, []);
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            if (e.key == "Enter") {
                e.preventDefault();
                if (commandPrompt.current.value != undefined) {
                    commander(
                        commandPrompt.current.value,
                        dialog.current,
                        config,
                        setRes
                    );
                }
                window.document.removeEventListener("keyup", handle);
            }

            if (e.key == "Escape") {
                e.preventDefault();
                removeWindow("command");
                commandPrompt.current.parentElement?.remove();
            }
        };
        commandPrompt.current.addEventListener("keydown", handle);
        commandPrompt.current.focus();
    });

    return (
        <div>
            <div
                style={{
                    overflowWrap: "break-word",
                    background: "white",
                    borderRadius: "5px",
                    padding: "5px",
                }}
                ref={dialog}
            >
                {results != null ? results : ""}
            </div>
            <input
                placeholder="command"
                ref={commandPrompt}
                className="cmd"
                defaultValue={value}
                onInput={async (e) => {
                    const el = e.target as HTMLInputElement;
                    const d = dialog.current;
                    if (el.value.startsWith("o")) {
                        d.style.setProperty("border", "1px solid black");
                        const rawPath = el.value.split(" ")[1].trim();
                        const Path = await resolve(rawPath);
                        const items = await readDir(Path, {});
                        const list = items.map((c) => <p>{c.name}</p>);
                        setRes(<p id="">{list}</p>);
                    } else {
                        d.style.setProperty("border", "0px solid white");
                        setRes(null);
                    }
                }}
                style={{
                    width: "100%",
                    marginTop: "10px",
                    border: "none",
                    borderBottom: "1px solid black",
                    outline: "none",
                    background: "var(--cmd-bg-color)",
                    color: "var(--cmd-fg-color)",
                    ...config.cmd_theme.styles,
                }}
            />
        </div>
    );
};
