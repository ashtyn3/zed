import { getMatches } from "@tauri-apps/api/cli";

export interface themePair {
    background: string;
    foreground: string;
}

export interface Config {
    theme?: themePair;
    font: string;
    guiMode: string;
}

export const read = async (): Promise<Config> => {
    const defConfig: Config = {
        theme: {
            background: "white",
            foreground: "black",
        },
        font: "Inter",
        guiMode: "graphic",
    };
    const args = await getMatches();
    const conf = args.args["config"].value?.toString();
    if (conf) {
        return JSON.parse(conf);
    }

    return defConfig;
};
