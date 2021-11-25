import React, { useEffect, useRef, useState } from "react";

import { removeWindow } from "./wm";
import { Config } from "../config/conf";

const commander = (cmd: string, config: Config, set: any) => {
    if (cmd == "r" || cmd == "reload") {
        document.location.reload();
    }
    if (cmd == "c" || cmd == "config") {
        set(JSON.stringify(config));
    }
};
type Cmd = {
    config: Config;
};

export const Cmd = ({ config }: Cmd) => {
    const commandPrompt = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [results, setRes] = useState(null);

    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            if (e.key == "Enter") {
                e.preventDefault();
                if (commandPrompt.current.value != undefined) {
                    commander(commandPrompt.current.value, config, setRes);
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
            <div style={{ overflowWrap: "break-word" }}>
                {results != null ? results : ""}
            </div>
            <input
                placeholder="command"
                ref={commandPrompt}
                className="cmd"
                style={{
                    width: "100%",
                    marginTop: "10px",
                    border: "none",
                    borderBottom: "1px solid black",
                    outline: "none",
                }}
            />
        </div>
    );
};
