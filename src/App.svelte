<script>
    import { Editor } from "@tiptap/core";
    import StarterKit from "@tiptap/starter-kit";
    import { onMount } from "svelte";
    import Menu from "./components/Menu.svelte";
    import fontSize from "./editor/fontsize";
    import TextStyle from "@tiptap/extension-text-style";
    import { keyboard } from "./editor/keyboard";
    import WM from "./components/wm.svelte";
    import Placeholder from "@tiptap/extension-placeholder";
    import { read } from "./config/conf";
    import { config } from "./components/store";

    let element;
    let editor;
    let root;
    onMount(async () => {
        const conf = await read();
        config.set(conf);
        root.style = conf.win_theme.styles.join(";");
        root.style.setProperty("--background", conf.win_theme.theme.background);
        root.style.setProperty(
            "--foreground",
            conf.win_theme.theme.foreground.split(" ")[0]
        );
        root.style.setProperty(
            "--holder-foreground",
            conf.win_theme.theme.foreground.split(" ")[1] || "#adb5bd"
        );

        editor = new Editor({
            element: element,
            extensions: [
                StarterKit,
                fontSize,
                TextStyle,
                keyboard,
                Placeholder.configure({
                    placeholder: "Write something…",
                }),
            ],
            //content: `<p ><span style="font-size: 16pt">Hello World! 🌍️ </span></p>`,
            onTransaction: () => {
                editor = editor;
            },
        });
    });
</script>

<main bind:this={root}>
    <WM />

    <Menu {editor} />

    <div
        contenteditable="true"
        class="title"
        placeholder="An epic story"
        on:blur={async (e) => {
            if (e.target.innerText.trim() == "") {
                while (e.target.firstChild) {
                    e.target.removeChild(e.target.firstChild);
                }
            }
        }}
    />
    <div class="holder">
        <div bind:this={element} />
    </div>
</main>

<style>
    :root {
        --background: white;
        --foreground: black;
        --holder-foreground: #adb5bd;
    }
    main {
        background: var(--background);
        color: var(--foreground);
        width: 100%;
        height: 100vh;
        padding: 10px;
    }
    .title {
        font-size: 20pt;
        font-weight: 600;
    }
    .title:empty:not(:focus):before {
        content: attr(placeholder);
        color: var(--holder-foreground);
    }

    /* Placeholder (at the top) */
    :global(.ProseMirror p.is-editor-empty:first-child::before) {
        color: var(--holder-foreground);
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }
</style>
