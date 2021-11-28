import { getMatches } from "@tauri-apps/api/cli";
import bs58 from "bs58";

export interface themePair {
    background: string;
    foreground: string;
}

export interface Config {
    theme?: themePair;
    cmd_theme?: {
        theme: themePair;
        styles: any;
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
        theme: {
            background: "white",
            foreground: "black",
        },
        cmd_theme: {
            theme: {
                background: "white",
                foreground: "black",
            },
            styles: [],
        },
        font: "Inter",
        guiMode: "graphic",
    };
    const args = await getMatches();
    const encConf = args.args["config"].value;
    const configBytes = bs58.decode(encConf.toString());
    const configStr = configBytes.toString("utf-8");
    if (encConf) {
        let obj: Config = JSON.parse(configStr);
        const newDefConfig: Config = MergeRecursive(defConfig, obj);
        const styles = {};
        newDefConfig.cmd_theme.styles.forEach((e) => {
            const name = e.split(":")[0];
            const body = e.split(":")[1];

            styles[name] = body;
        });
        newDefConfig.cmd_theme.styles = styles;
        defConfig = newDefConfig;
    }

    return defConfig;
};
