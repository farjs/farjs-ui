export default ModalContent;
export type BlessedPadding = {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
};
export type ModalContentProps = {
    readonly title: string;
    readonly width: number;
    readonly height: number;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    readonly padding?: BlessedPadding;
    readonly left?: import("@farjs/blessed").Widgets.Types.TTopLeft;
    readonly footer?: string;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly right: number;
 *  readonly top: number;
 *  readonly bottom: number;
 * }} BlessedPadding
 */
/**
 * @typedef {{
 *  readonly title: string;
 *  readonly width: number;
 *  readonly height: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly padding?: BlessedPadding;
 *  readonly left?: import("@farjs/blessed").Widgets.Types.TTopLeft;
 *  readonly footer?: string;
 * }} ModalContentProps
 */
/**
 * @param {React.PropsWithChildren<ModalContentProps>} props
 */
declare function ModalContent(props: React.PropsWithChildren<ModalContentProps>): React.ReactElement<{
    clickable: boolean;
    autoFocus: boolean;
    width: number;
    height: number;
    top: string;
    left: import("blessed").Widgets.Types.TTopLeft;
    shadow: boolean;
    padding: BlessedPadding;
    style: import("blessed").Widgets.Types.TStyle;
}, string | React.JSXElementConstructor<any>>;
declare namespace ModalContent {
    export const displayName: string;
    export { DoubleBorder as doubleBorderComp };
    export const paddingHorizontal: number;
    export const paddingVertical: number;
    export const padding: BlessedPadding;
}
import React from "react";
import DoubleBorder from "../border/DoubleBorder.mjs";
