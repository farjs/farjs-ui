export default WithSize;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type WithSizeProps = {
    render(width: number, height: number): React.ReactElement | null;
};
/**
 * @typedef {{
 *  render(width: number, height: number): React.ReactElement | null;
 * }} WithSizeProps
 */
/**
 * @param {WithSizeProps} props
 */
declare function WithSize(props: WithSizeProps): React.ReactElement<{
    ref: React.MutableRefObject<import("blessed").Widgets.BlessedElement>;
    style: import("blessed").Widgets.Types.TStyle;
    onResize: () => void;
}, string | React.JSXElementConstructor<any>>;
declare namespace WithSize {
    let displayName: string;
}
import React from "react";
