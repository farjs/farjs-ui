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
declare function TextBox(props: TextBoxProps): React.FunctionComponentElement<{
    inputRef: React.MutableRefObject<import("blessed").Widgets.BlessedElement>;
    left: number;
    top: number;
    width: number;
    value: string;
    state: import("./TextInput.mjs").TextInputState;
    stateUpdater: React.Dispatch<React.SetStateAction<import("./TextInput.mjs").TextInputState>>;
    onChange: (value: string) => void;
    onEnter: (() => void) | undefined;
}>;
declare namespace TextBox {
    export let displayName: string;
    export { TextInput as textInputComp };
}
import React from "react";
import TextInput from "./TextInput.mjs";
