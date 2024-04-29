export default BottomMenu;
export type BottomMenuProps = {
    readonly items: string[];
};
/**
 * @typedef {{
 *  readonly items: string[];
 * }} BottomMenuProps
 */
/**
 * @param {BottomMenuProps} props
 */
declare function BottomMenu(props: BottomMenuProps): React.FunctionComponentElement<import("../WithSize.mjs").WithSizeProps>;
declare namespace BottomMenu {
    export const displayName: string;
    export { WithSize as withSizeComp };
    export { BottomMenuView as bottomMenuViewComp };
}
import React from "react";
import WithSize from "../WithSize.mjs";
import BottomMenuView from "./BottomMenuView.mjs";
