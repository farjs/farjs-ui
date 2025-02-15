export default TextInput;
export type TextInputProps = {
    readonly inputRef: React.MutableRefObject<BlessedElement>;
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly value: string;
    readonly state: TextInputState;
    stateUpdater(update: (state: TextInputState) => TextInputState): void;
    onChange(value: string): void;
    onEnter?(): void;
    onKeypress?(keyFull: string): boolean;
};
export type TextInputState = {
    readonly offset: number;
    readonly cursorX: number;
    readonly selStart: number;
    readonly selEnd: number;
};
export type TextSelect = "Reset" | "All" | "TillTheHome" | "TillTheEnd" | "ToTheLeft" | "ToTheRight";
export type EditResult = {
    value: string;
    cm: CursorMove;
};
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type IKeyEventArg = import("@farjs/blessed").Widgets.Events.IKeyEventArg & {
    defaultPrevented?: boolean;
};
export type MouseEvent = import("@farjs/blessed").Widgets.Events.IMouseEventArg;
export type CursorMove = {
    readonly move: "At";
    readonly pos: number;
} | {
    readonly move: "Home";
} | {
    readonly move: "End";
} | {
    readonly move: "Left";
    readonly dx?: number;
} | {
    readonly move: "Right";
    readonly dx?: number;
};
export type TextEdit = {
    readonly edit: "Insert";
    readonly str: import("./UiString.mjs").UiString;
} | {
    readonly edit: "Delete";
} | {
    readonly edit: "Backspace";
};
/**
 * @param {TextInputProps} props
 */
declare function TextInput(props: TextInputProps): React.ReactElement<{
    ref: React.MutableRefObject<import("blessed").Widgets.BlessedElement>;
    autoFocus: boolean;
    clickable: boolean;
    keyable: boolean;
    width: number;
    height: number;
    left: number;
    top: number;
    style: import("./theme/Theme.mjs").ThemeEffects;
    wrap: boolean;
    tags: boolean;
    content: string;
    onClick: (data: MouseEvent) => void;
    onResize: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onKeypress: (ch: object | null | undefined, key: IKeyEventArg) => void;
}, string | React.JSXElementConstructor<any>>;
declare namespace TextInput {
    let displayName: string;
    /**
     * @returns {TextInputState}
     */
    function createState(): TextInputState;
}
import React from "react";
