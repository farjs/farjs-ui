export default ProgressBar;
export type ProgressBarProps = {
    readonly percent: number;
    readonly left: number;
    readonly top: number;
    readonly length: number;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
};
/**
 * @typedef {{
 *  readonly percent: number;
 *  readonly left: number;
 *  readonly top: number;
 *  readonly length: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 * }} ProgressBarProps
 */
/**
 * @param {ProgressBarProps} props
 */
declare function ProgressBar(props: ProgressBarProps): React.ReactElement<{
    width: number;
    height: number;
    left: number;
    top: number;
    style: import("blessed").Widgets.Types.TStyle;
    content: string;
}, string | React.JSXElementConstructor<any>>;
declare namespace ProgressBar {
    const displayName: string;
    const filledCh: string;
    const dottedCh: string;
}
import React from "react";
