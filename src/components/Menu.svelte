<script lang="ts">
    import "./menu.css";
    import Select from "svelte-select";
    import Item from "./Item.svelte";
    import SizeItem from "./SizeItem.svelte";
    import {
        selectedItem,
        listOpen,
        size,
        sizeListOpen,
        lastHead,
    } from "./store";
    import FontSize from "../editor/fontsize";
    import { onMount } from "svelte";
    import type { EditorMain } from "../editor/editor";

    export let editor: EditorMain;
    const sizeVar = size;

    const Header = (label: 1 | 2) => {
        const pos = editor.state.selection.$anchor.pos;
        editor.commands.toggleHeading({ level: label });
        editor.commands.focus(pos);
        lastHead.update(() => true);
        return editor.isActive("heading", { level: label });
    };

    const options = [
        { label: "Heading", value: "1" },
        { label: "Sub Heading", value: "2" },
    ];
    const sizeOptions = [
        { label: "8", value: "8pt" },
        { label: "9", value: "9pt" },
        { label: "10", value: "10pt" },
        { label: "11", value: "11pt" },
        { label: "12", value: "12pt" },
        { label: "14", value: "14pt" },
        { label: "16", value: "16pt" },
        { label: "18", value: "18pt" },
        { label: "24", value: "24pt" },
        { label: "30", value: "30pt" },
        { label: "36", value: "36pt" },
        { label: "48", value: "48pt" },
        { label: "60", value: "60pt" },
        { label: "72", value: "72pt" },
        { label: "96", value: "96pt" },
    ];
    FontSize.configure({
        types: ["textStyle"],
    });
    size.subscribe((e) => {
        if (editor && e.transform) {
            editor.commands.setFontSize(e.value);
        }
    });
    selectedItem.subscribe((e) => {
        if (e && editor) {
            Header(parseInt(e.value) as 1 | 2);
        }
    });
    $: if (editor && editor.getAttributes("textStyle").size != $size.value) {
        const size = editor.getAttributes("textStyle").size;
        if (size != undefined) {
            sizeVar.update(() => {
                return {
                    label: `${size.replace("pt", "")}`,
                    value: `${size}`,
                    transform: false,
                };
            });
        } else {
            if (editor.getAttributes("heading").level == 1) {
                sizeVar.update(() => {
                    return { label: `24`, value: `24pt`, transform: true };
                });
            }
            if (editor.getAttributes("heading").level == 2) {
                sizeVar.update(() => {
                    return { label: `18`, value: `18pt`, transform: true };
                });
            }
        }
    }
</script>

{#if editor}
    <div class="btn-nav">
        <button
            on:click={() => editor.chain().focus().toggleBold().run()}
            class:active={editor.isActive("bold")}
        >
            <b>B</b>
        </button>
        <button
            on:click={() => editor.chain().focus().toggleItalic().run()}
            class:active={editor.isActive("italic")}
        >
            <em>I</em>
        </button>

        <button
            on:click={() => editor.chain().focus().toggleBulletList().run()}
            class:active={editor.isActive("bulletList")}
        >
            bl
        </button>
        <button
            on:click={() => editor.chain().focus().toggleOrderedList().run()}
            class:active={editor.isActive("orderedList")}
        >
            ol
        </button>

        <Select
            items={options}
            isClearable={false}
            bind:value={$selectedItem}
            bind:listOpen={$listOpen}
            {Item}
        />
        <Select
            items={sizeOptions}
            isClearable={false}
            Item={SizeItem}
            bind:value={$size}
            bind:listOpen={$sizeListOpen}
        />
    </div>
{/if}
