export default HorizontalLine;
export type HorizontalLineProps = {
    readonly left: number;
    readonly top: number;
    readonly length: number;
    readonly lineCh: string;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    readonly startCh?: string;
    readonly endCh?: string;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly length: number;
 *  readonly lineCh: string;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly startCh?: string;
 *  readonly endCh?: string;
 * }} HorizontalLineProps
 */
/**
 * @param {HorizontalLineProps} props
 */
declare function HorizontalLine(props: HorizontalLineProps): React.ReactElement<{
    width: number;
    height: number;
    left: number;
    top: number;
    style: import("blessed").Widgets.Types.TStyle;
    content: string;
}, string | React.JSXElementConstructor<any>>;
declare namespace HorizontalLine {
    const displayName: string;
}
import React from "react";
