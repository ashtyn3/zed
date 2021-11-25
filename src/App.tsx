// import Paragraph from "@tiptap/extension-paragraph";
import "./App.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import * as fs from "@tauri-apps/api/fs";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import * as pako from "pako";
import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";

import { EditBody, EditorMain } from "./components/editor";
import FontSize from "./components/font-size";
import Menu from "./components/menu";
import { EditorView } from "prosemirror-view";
import TabKey from "./components/tab-key";
import { finished, render, waiting } from "./components/wm";
import { read, ConfigRead } from "./config/conf";
import * as store from "./store/store_pb";
import { IFile } from "./store/store";

const Loading = (
    <Loader
        type="TailSpin"
        color="#181818"
        height={20}
        width={20}
        // @ts-ignore
        className="loader"
    />
);

const StateNotif = (props: JSX.Element | string) => {
    return (
        <div style={{ opacity: props == "" ? "0" : "1" }}>
            {props == "Saving..." || props == "Loading..." ? Loading : ""}
            <p>{props}</p>
        </div>
    );
};

//EditorView.prototype.updateState = function updateState(state) {
//if (!this.docView) return; // This prevents the matchesNode error on hot reloads
//this.updateStateInner(state, this.state.plugins != state.plugins);
//};
const openRecent = async (): Promise<IFile> => {
    // const file = await fs.readBinaryFile(localStorage.getItem("path"));
    const path = localStorage.getItem("path");
    if (path == null) {
        return {};
    }
    const file: Array<number> = await fs.readBinaryFile(path.trim());
    const inflated = pako.inflate(file);
    const content = store.File.decode(inflated);
    return content;
};
const Windows = () => {
    const wins = render();
    if (waiting.length == 0) {
        return <div>{finished}</div>;
    }

    return wins;
};

EditorView.prototype.updateState = function updateState(state) {
    //@ts-ignore
    if (!this.docView) return; // This prevents the matchesNode error on hot reloads
    //@ts-ignore
    this.updateStateInner(state, this.state.plugins != state.plugins);
};

function App() {
    const [conf, setConf] = useState<ConfigRead>();
    const [content, setContent] = useState({});
    useEffect(() => {
        (async () => {
            const conf = await read();
            setConf(conf);
            document.body.style.setProperty("--font", conf.config.font);
            document.body.style.setProperty(
                "--main-bg-color",
                conf.config.theme.background
            );
            document.body.style.setProperty(
                "--main-fg-color",
                conf.config.theme.foreground
            );
        })();
    }, []);

    // document.body.style.backgroundColor = conf.config.theme.background;
    // document.body.style.color = conf.config.theme.foreground;

    const [Status, setStatus] = useState("");
    useEffect(() => {
        setTimeout(() => {
            if (Status == "Saving..." || Status == "Loading...") {
                setStatus("");
            }
        }, 5000);
    });
    const Heading2 = Heading.extend({
        addAttributes() {
            return { style: "font-size: 32px" };
        },
    });

    const keys = TabKey(setStatus);
    const editor = useEditor({
        extensions: [StarterKit, FontSize, TextStyle, keys, Heading2],
        content: (() => content)(),
    }) as EditorMain;

    useEffect(() => {
        (async () => {
            if (editor != null) {
                const content = await openRecent();
                if (content.Doc && content.Name) {
                    const doc = JSON.parse(content.Doc);
                    editor.commands.setContent(doc);
                    editor.title = content.Name;
                }
            }
        })();
    }, [editor]);
    return (
        <div className="App" style={{}}>
            <Windows />
            <div className="status-label">
                {(() => {
                    return StateNotif(Status);
                })()}
            </div>
            <EditBody editor={editor} title={editor?.title} />
            <Menu editor={editor} />
        </div>
    );
}

export default App;
