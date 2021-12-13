import { getMatches } from "@tauri-apps/api/cli";
import { Buffer } from "buffer";
import bs58 from "bs58";
import type { Properties } from "csstype";

export interface themePair {
    background: string;
    foreground: string;
}

export interface Config {
    win_theme?: { theme: themePair; styles: Array<string> };
    cmd_theme?: {
        body: Array<string>;
        doc: Array<string>;
        input: Array<string>;
    };
    font: string;
    guiMode: "graphic" | "text";
}

function MergeRecursive(obj1, obj2) {
    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[p].constructor == Object) {
                obj1[p] = MergeRecursive(obj1[p], obj2[p]);
            } else {
                if (obj2[p] != "") {
                    obj1[p] = obj2[p];
                }
            }
        } catch (e) {
            // Property in destination object not set; create it and set its value.
            if (obj2[p] != "") {
                obj1[p] = obj2[p];
            }
        }
    }

    return obj1;
}

export const read = async (): Promise<Config> => {
    let defConfig: Config = {
        win_theme: {
            theme: {
                background: "white",
                foreground: "black",
            },
            styles: [],
        },
        cmd_theme: {
            body: [],
            doc: [],
            input: [],
        },
        font: "Inter",
        guiMode: "graphic",
    };
    const args = await getMatches();
    const encConf = args.args["config"].value;
    if (encConf) {
        const configBytes = bs58.decode(encConf.toString());
        const configStr = configBytes.toString("utf-8");
        let obj: Config = JSON.parse(configStr);
        return MergeRecursive(defConfig, obj);
    }
    return defConfig
};
