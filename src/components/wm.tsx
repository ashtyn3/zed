import parse from "html-react-parser";
import React from "react";

export let waiting: Array<JSX.Element> = [];
export let finished: Array<JSX.Element> = [];
export const render = () => {
    if (waiting.length == 0) {
        return <div></div>;
    }
    let toRender = waiting;
    waiting = [];

    let names: Array<JSX.Element> = [];
    toRender = toRender.filter((el) => {
        if (!names.includes(el.props.className)) {
            names.push(el.props.className);
            return el;
        }
    });
    finished.filter((el, i) => {
        if (names.includes(el.props.className)) {
            finished.splice(i, 1);
        }
    });
    finished.push(...toRender);

    return <div>{toRender}</div>;
};

export const update = () => {
    return <div>{finished}</div>;
};
export const createWindow = (
    name: string,
    content: string | JSX.Element,
    posX: string,
    posY: string,
    width: string,
    height: string,
    style: React.CSSProperties
) => {
    const el = (
        <div
            className={name}
            key={Math.random()}
            style={{
                height: height.toString(),
                width: width.toString(),
                left: posX,
                top: posY,
                position: "absolute",
                border: "1px solid black",
                ...style,
            }}
        >
            {content}
        </div>
    );
    waiting.push(el);
    return el;
};

export const removeWindow = (className:string) => {
    finished = finished.filter((e) => {
        if (e.props.className != className) {
            return e;
        }
    });
};
