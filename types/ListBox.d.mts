export default ListBox;
export type IKeyEventArg = import("@farjs/blessed").Widgets.Events.IKeyEventArg;
export type ListBoxProps = {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    readonly items: readonly string[];
    readonly selected: number;
    onAction(index: number): void;
    onSelect?(index: number): void;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly width: number;
 *  readonly height: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly items: readonly string[];
 *  readonly selected: number;
 *  onAction(index: number): void;
 *  onSelect?(index: number): void;
 * }} ListBoxProps
 */
/**
 * @param {ListBoxProps} props
 */
declare function ListBox(props: ListBoxProps): React.ReactElement<{
    left: number;
    top: number;
    width: number;
    height: number;
    onKeypress: (ch: any, key: IKeyEventArg) => void;
}, string | React.JSXElementConstructor<any>>;
declare namespace ListBox {
    export let displayName: string;
    export { ListView as listViewComp };
    export { ScrollBar as scrollBarComp };
}
import React from "react";
import ListView from "./ListView.mjs";
import ScrollBar from "./ScrollBar.mjs";
