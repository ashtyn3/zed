import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";
interface Css extends CSSStyleDeclaration {
    size: string;
}
const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
        return { types: ["textStyle"], defaultSize: "12px" };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    size: {
                        default: this.options.size,
                        parseHTML: (element) => {
                            const eStyle = element.style as Css;
                            return eStyle.size.replace(/['"]+/g, "");
                        },
                        renderHTML: (attributes) => {
                            if (attributes.size === this.options.size) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.size}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands(): any {
        return {
            setFontSize:
                (size: string) =>
                ({ chain }: { chain: any }) => {
                    return chain().focus().setMark("textStyle", { size }).run();
                },
        };
    },
});

export default FontSize;
