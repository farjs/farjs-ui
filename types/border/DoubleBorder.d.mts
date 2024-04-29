export default DoubleBorder;
export type DoubleBorderProps = {
    readonly width: number;
    readonly height: number;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    readonly left?: number;
    readonly top?: number;
    readonly title?: string;
    readonly footer?: string;
};
/**
 * @typedef {{
 *  readonly width: number;
 *  readonly height: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly left?: number;
 *  readonly top?: number;
 *  readonly title?: string;
 *  readonly footer?: string;
 * }} DoubleBorderProps
 */
/**
 * @param {DoubleBorderProps} props
 */
declare function DoubleBorder(props: DoubleBorderProps): React.FunctionComponentElement<{}>;
declare namespace DoubleBorder {
    export const displayName: string;
    export { HorizontalLine as horizontalLineComp };
    export { VerticalLine as verticalLineComp };
    export { TextLine as textLineComp };
}
import React from "react";
import HorizontalLine from "./HorizontalLine.mjs";
import VerticalLine from "./VerticalLine.mjs";
import TextLine from "../TextLine.mjs";
