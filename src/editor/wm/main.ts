import { writable } from "svelte/store";
import type { SvelteComponentTyped } from "svelte";

interface Window {
    name: string;
    component: new (...args: unknown[]) => SvelteComponentTyped;
    floating?: boolean;
}

const winQueue = writable([] as Array<Window>);

export const createWindow = async (
    name: string,
    comp: Promise<typeof import("*.svelte")>,
    floating: boolean
) => {
    const item: Window = { name, component: (await comp).default, floating };
    winQueue.update((e) => {
        e.push(item);
        return e;
    });
};

export const removeWindow = (className: string) => {
    winQueue.update((win) => {
        return win.filter((e) => {
            if (e.name != className) {
                return e;
            }
        });
    });
};
export default winQueue;
