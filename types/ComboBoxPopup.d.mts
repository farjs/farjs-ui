export default ComboBoxPopup;
export type ListViewport = import("./ListViewport.mjs").ListViewport;
export type ComboBoxPopupProps = {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly items: readonly string[];
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    readonly viewport: ListViewport;
    setViewport(viewport: ListViewport): void;
    onClick(index: number): void;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly width: number;
 *  readonly items: readonly string[];
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly viewport: ListViewport;
 *  setViewport(viewport: ListViewport): void;
 *  onClick(index: number): void;
 * }} ComboBoxPopupProps
 */
/**
 * @param {ComboBoxPopupProps} props
 */
declare function ComboBoxPopup(props: ComboBoxPopupProps): React.ReactElement<{
    clickable: boolean;
    autoFocus: boolean;
    width: number;
    height: number;
    left: number;
    top: number;
    onWheelup: () => void;
    onWheeldown: () => void;
    style: import("blessed").Widgets.Types.TStyle;
}, string | React.JSXElementConstructor<any>>;
declare namespace ComboBoxPopup {
    export let displayName: string;
    export { SingleBorder as singleBorderComp };
    export { ListView as listViewComp };
    export { ScrollBar as scrollBarComp };
    export let maxItems: number;
}
import React from "react";
import SingleBorder from "./border/SingleBorder.mjs";
import ListView from "./ListView.mjs";
import ScrollBar from "./ScrollBar.mjs";
