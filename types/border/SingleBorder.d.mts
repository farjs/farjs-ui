export default SingleBorder;
export type SingleBorderProps = {
    readonly width: number;
    readonly height: number;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
};
/**
 * @typedef {{
 *  readonly width: number;
 *  readonly height: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 * }} SingleBorderProps
 */
/**
 * @param {SingleBorderProps} props
 */
declare function SingleBorder(props: SingleBorderProps): React.FunctionComponentElement<{}>;
declare namespace SingleBorder {
    export let displayName: string;
    export { HorizontalLine as horizontalLineComp };
    export { VerticalLine as verticalLineComp };
}
import React from "react";
import HorizontalLine from "./HorizontalLine.mjs";
import VerticalLine from "./VerticalLine.mjs";
