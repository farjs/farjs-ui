export default TextBox;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type TextInputState = import("./TextInput.mjs").TextInputState;
export type TextBoxProps = {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly value: string;
    onChange(value: string): void;
    onEnter?(): void;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly width: number;
 *  readonly value: string;
 *  onChange(value: string): void;
 *  onEnter?(): void;
 * }} TextBoxProps
 */
/**
 * @param {TextBoxProps} props
 */
declare function TextBox(props: TextBoxProps): React.FunctionComponentElement<import("./TextInput.mjs").TextInputProps>;
declare namespace TextBox {
    export const displayName: string;
    export { TextInput as textInputComp };
}
import React from "react";
import TextInput from "./TextInput.mjs";
