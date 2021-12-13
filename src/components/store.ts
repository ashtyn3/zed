import { writable } from "svelte/store";
import type { Config } from "../config/conf";

export let selectedItem = writable<{ label: string; value: string }>({
    label: "Heading",
    value: "0",
});
export let listOpen = writable(false);

export let size = writable({ label: "12", value: "12pt", transform: false });
export let sizeListOpen = writable(false);

export let config = writable<Config>();

export let lastHead = writable<boolean>(false);
