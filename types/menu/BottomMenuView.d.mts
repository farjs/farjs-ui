export default BottomMenuView;
export type BottomMenuViewProps = {
    readonly width: number;
    readonly items: string[];
};
export type BottomMenuViewItem = {
    readonly key: number;
    readonly item: string;
    readonly pos: number;
    readonly textWidth: number;
};
/**
 * @typedef {{
 *  readonly width: number;
 *  readonly items: string[];
 * }} BottomMenuViewProps
 */
/**
 * @typedef {{
 *  readonly key: number;
 *  readonly item: string;
 *  readonly pos: number;
 *  readonly textWidth: number;
 * }} BottomMenuViewItem
 */
/**
 * @param {BottomMenuViewProps} props
 */
declare function BottomMenuView(props: BottomMenuViewProps): React.FunctionComponentElement<{}>;
declare namespace BottomMenuView {
    const displayName: string;
}
import React from "react";
