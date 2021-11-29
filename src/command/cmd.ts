import { resolve } from "@tauri-apps/api/path";
import { Config } from "../config/conf";

export const commander = async (
    cmd: string,
    dialog: HTMLDivElement,
    config: Config,
    set?: any
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
