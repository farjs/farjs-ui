export default TextLine;
export type TextLineProps = {
    readonly align: import("./TextAlign.mjs").TextAlign;
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly text: string;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    readonly focused?: boolean;
    readonly padding?: number;
};
/**
 * @typedef {{
 *  readonly align: import("./TextAlign.mjs").TextAlign;
 *  readonly left: number;
 *  readonly top: number;
 *  readonly width: number;
 *  readonly text: string;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly focused?: boolean;
 *  readonly padding?: number;
 * }} TextLineProps
 */
/**
 * @param {TextLineProps} props
 */
declare function TextLine(props: TextLineProps): React.ReactElement<{
    width: number;
    height: number;
    left: number;
    top: number;
    style: import("blessed").Widgets.Types.Effects | undefined;
    content: string;
}, string | React.JSXElementConstructor<any>> | null;
declare namespace TextLine {
    let displayName: string;
    /**
     * @param {string} text
     * @param {number} width
     * @param {number} prefixLen
     * @returns {string}
     */
    function wrapText(text: string, width: number, prefixLen?: number): string;
}
import React from "react";
