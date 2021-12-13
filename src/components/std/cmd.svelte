<script lang="ts">
    import hotkey from "hotkeys-js";
    import { onMount } from "svelte";
    import { removeWindow } from "../../editor/wm/main";
    import { config } from "../store";

    let value: string;
    let doc = "";
    let input: HTMLInputElement;

    let styleStrings: { body: string; input: string; doc: string } = {
        body: "",
        input: "",
        doc: "",
    };
    export let style: {
        body: Array<string>;
        input: Array<string>;
        doc: Array<string>;
    } = $config.cmd_theme || {
        body: ["color: black"],
        input: ["color: black"],
        doc: ["color: black"],
    };

    $: if (style["body"]) styleStrings["body"] = style["body"].join(";");

    $: if (style["input"]) styleStrings["input"] = style["input"].join(";");

    $: if (style["doc"]) styleStrings["doc"] = style["doc"].join(";");

    onMount(() => {
        hotkey("escape", () => {
            removeWindow("cmd");
        });
        input.focus();
    });

    const command = (arg: string, el: HTMLInputElement) => {
        if (arg.startsWith("echo")) {
            doc = arg.split(" ")[1];
        }
        el.value = "";
    };

    const handleIn = (e: KeyboardEvent) => {
        if (e.key == "Enter") {
            e.preventDefault();
            const el = e.target as HTMLInputElement;
            command(value, el);
        }
    };
</script>

<div
    style={styleStrings.body ? styleStrings.body : styleStrings.body + ";"}
    class="cmd-body"
>
    <div
        style={styleStrings.doc ? styleStrings.doc : styleStrings.doc + ";"}
        class="cmd-doc"
    >
        {doc}
    </div>
    <input
        style={styleStrings.input
            ? styleStrings.input
            : styleStrings.input + ";"}
        id="cmd"
        placeholder="command..."
        bind:value
        bind:this={input}
        on:keyup={handleIn}
        class="cmd-input"
    />
</div>

<style>
    .cmd-body {
        width: 100%;
        display: grid;
        grid-template-rows: inherit inherit;
        grid-template-columns: 100%;
        padding: 15px;
        height: fit-content;
        justify-items: center;

        color: black;
    }
    .cmd-input {
        width: 60%;
    }
    .cmd-doc {
        text-align: left;
        width: 60%;
        padding: 5px;
    }
</style>
