export default ComboBox;
export type BlessedProgram = import("@farjs/blessed").BlessedProgram;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type ListViewport = import("./ListViewport.mjs").ListViewport;
export type TextInputState = import("./TextInput.mjs").TextInputState;
export type ComboBoxProps = {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly items: string[];
    readonly value: string;
    onChange(value: string): void;
    onEnter?(): void;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly width: number;
 *  readonly items: string[];
 *  readonly value: string;
 *  onChange(value: string): void;
 *  onEnter?(): void;
 * }} ComboBoxProps
 */
/**
 * @param {ComboBoxProps} props
 */
declare function ComboBox(props: ComboBoxProps): React.FunctionComponentElement<{}>;
declare namespace ComboBox {
    export const displayName: string;
    export { TextInput as textInputComp };
    export { ComboBoxPopup as comboBoxPopup };
    export const arrowDownCh: string;
}
import React from "react";
import TextInput from "./TextInput.mjs";
import ComboBoxPopup from "./ComboBoxPopup.mjs";
