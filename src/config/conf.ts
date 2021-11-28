import { getMatches } from "@tauri-apps/api/cli";
import bs58 from "bs58";

export interface themePair {
    background: string;
    foreground: string;
}

export interface Config {
    theme?: themePair;
    font: string;
    guiMode: "graphic" | "text";
}

const propertiesToArray = (obj: any) => {
    const isObject = (val: any) =>
        typeof val === "object" && !Array.isArray(val);

    const addDelimiter = (a: any, b: any) => (a ? `${a}.${b}` : b);

    const paths = (obj = {}, head = "") => {
        return Object.entries(obj).reduce((product, [key, value]) => {
            let fullPath = addDelimiter(head, key);
            return isObject(value)
                ? product.concat(paths(value, fullPath))
                : product.concat(fullPath);
        }, []);
    };

    return paths(obj);
};
const nestedString = (index: string, obj: any, pointer: boolean) => {
    let base = obj;
    let path = [];
    index.split(/\.(\w+)/).forEach((e) => {
        if (e == "") {
            base = obj;
            return;
        }
        base = base[e];
        path.push(base);
    });
    if (pointer) {
        return path[0];
    }
    return path[path.length - 1];
};
export const read = async (): Promise<Config> => {
    let defConfig: Config = {
        theme: {
            background: "white",
            foreground: "black",
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
        let props: Array<string> = propertiesToArray(obj);
        let defProps: Array<string> = propertiesToArray(defConfig);

        defProps.forEach((p2) => {
            let defv = nestedString(p2, defConfig, true);
            props.forEach((p) => {
                if (p.match(/(\w+)\.(\w+)/)) {
                    let v = nestedString(p, obj, false);
                    let list = p2.split(".");
                    if (defv[list[list.length - 1]] && v != "" && p == p2) {
                        defv[list[list.length - 1]] = v;
                    }
                    return;
                }
                if (obj[p] != "") {
                    defConfig[p] = obj[p];
                }
            });
        });
    }

    return defConfig;
};
