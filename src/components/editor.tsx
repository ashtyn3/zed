import React from "react";
import { EditorContent } from "@tiptap/react";
import { Editor } from "@tiptap/react";

export interface EditorMain extends Editor {
    title: string;
}
type EditBody = {
    editor: EditorMain;
    title: string;
};
export const EditBody = ({ editor, title }: EditBody) => {
    return (
        <div className="">
            <div
                contentEditable="true"
                onInput={(e) => {
                    const input = e.target as HTMLElement;
                    editor.title = input.innerText;
                }}
            >
                {title}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
};
