export default VerticalLine;
export type VerticalLineProps = {
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
 * }} VerticalLineProps
 */
/**
 * @param {VerticalLineProps} props
 */
declare function VerticalLine(props: VerticalLineProps): React.ReactElement<{
    width: number;
    height: number;
    left: number;
    top: number;
    style: import("blessed").Widgets.Types.TStyle;
    content: string;
}, string | React.JSXElementConstructor<any>>;
declare namespace VerticalLine {
    let displayName: string;
}
import React from "react";
