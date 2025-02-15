export default BottomMenu;
export type BottomMenuProps = {
    readonly items: readonly string[];
};
/**
 * @typedef {{
 *  readonly items: readonly string[];
 * }} BottomMenuProps
 */
/**
 * @param {BottomMenuProps} props
 */
declare function BottomMenu(props: BottomMenuProps): React.FunctionComponentElement<{
    render: (width: number) => React.FunctionComponentElement<{
        width: number;
        items: readonly string[];
    }>;
}>;
declare namespace BottomMenu {
    export let displayName: string;
    export { WithSize as withSizeComp };
    export { BottomMenuView as bottomMenuViewComp };
}
import React from "react";
import WithSize from "../WithSize.mjs";
import BottomMenuView from "./BottomMenuView.mjs";
