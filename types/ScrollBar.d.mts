export default ScrollBar;
export type ScrollBarProps = {
    readonly left: number;
    readonly top: number;
    readonly length: number;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    readonly value: number;
    readonly extent: number;
    readonly min: number;
    readonly max: number;
    onChange(value: number): void;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly length: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly value: number;
 *  readonly extent: number;
 *  readonly min: number;
 *  readonly max: number;
 *  onChange(value: number): void;
 * }} ScrollBarProps
 */
/**
 * @param {ScrollBarProps} props
 */
declare function ScrollBar(props: ScrollBarProps): React.FunctionComponentElement<{}>;
declare namespace ScrollBar {
    let displayName: string;
    let markerCh: string;
    let scrollCh: string;
    let upArrowCh: string;
    let downArrowCh: string;
}
import React from "react";
