//@ts-nocheck
import "./menu.css";
import React from "react";
import { Editor } from "@tiptap/core";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import FontSize from "./font-size";

const Header = (label: string, editor: Editor) => {
    const labelInt = parseInt(label);
    editor.commands.toggleHeading({ level: labelInt });
    return editor.isActive("heading", { level: labelInt }) ? "is-active" : "";
};
type BtnProps = {
    editor: Editor;
};
const Btns = ({ editor }: BtnProps) => {
    if (editor == null) {
        return <p></p>;
    }
    const customStyles = {
        control: (base: React.CSSProperties) => ({
            ...base,
            background: "#181818",
            color: "white",
            border: "0px solid black",
            boxShadow: null,
            borderColor: "black",
        }),
        menu: (base: React.CSSProperties) => ({
            ...base,
            width: "max-content",
            border: "0px solid black",
        }),
        input: (base: React.CSSProperties) => ({
            ...base,
            color: "white",
            border: "0px solid black",
        }),
        menuList: (base: React.CSSProperties, state) => ({
            ...base,
            color: "white",
            borderRadius: 5,
            background: state.isActive ? "#454545" : "#181818",
            border: "0px solid black",
        }),
        singleValue: (base: React.CSSProperties, state) => ({
            ...base,
            color: "white",
            background: state.isActive ? "#454545" : "#181818",
            border: "0px solid black",
        }),
        option: (base: React.CSSProperties, state) => ({
            ...base,
            color: "white",
            background:
                state.isFocused || state.isActive ? "#454545" : "#181818",
            border: "0px solid black",
        }),
    };

    const options = [
        { label: "Heading", value: "1" },
        { label: "sub-heading", value: "2" },
    ];
    const sizeOptions = [
        { label: "8", value: "8px" },
        { label: "9", value: "9px" },
        { label: "10", value: "10px" },
        { label: "11", value: "11px" },
        { label: "12", value: "12px" },
        { label: "14", value: "14px" },
        { label: "16", value: "16px" },
        { label: "18", value: "18px" },
        { label: "24", value: "24px" },
        { label: "30", value: "30px" },
        { label: "36", value: "36px" },
        { label: "48", value: "48px" },
        { label: "60", value: "60px" },
        { label: "72", value: "72px" },
        { label: "96", value: "96px" },
    ];
    FontSize.configure({
        types: ["textStyle"],
    });
    return (
        <div className="btn-nav">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : ""}
            >
                <b>B</b>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "is-active" : ""}
            >
                <em>I</em>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "is-active" : ""}
            >
                bl
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "is-active" : ""}
            >
                ol
            </button>
            <CreatableSelect
                value={{
                    label: (() => {
                        if (editor.getAttributes("textStyle").size) {
                            let size = editor
                                .getAttributes("textStyle")
                                .size.split("px")[0];
                            return size;
                        }
                        return "16";
                    })(),
                }}
                styles={customStyles as any}
                onChange={(e: any) => {
                    editor.commands.setFontSize(e.value);
                }}
                className="header-dropdown"
                menuPlacement="top"
                options={sizeOptions}
                components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                }}
            />
            <Select
                defaultValue={options[0]}
                styles={customStyles as any}
                onChange={(e) => {
                    e.Classname = Header(e.value, editor);
                }}
                className="header-dropdown"
                menuPlacement="top"
                options={options}
                components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                }}
            />
        </div>
    );
};

//<select
//               defaultValue={options[0]}
//           styles={customStyles}
//               onChange={(e) => {
//                   e.Classname = Header(e.value, editor);
//               }}
//               className="header-dropdown"
//               menuPlacement="top"
//               options={options}
//               components={{
//                   DropdownIndicator: () => null,
//                   IndicatorSeparator: () => null,
//               }}
//           />
const Menu = ({ editor }) => {
    return (
        <div className="menu">
            <Btns editor={editor} />
        </div>
    );
};
export default Menu;
