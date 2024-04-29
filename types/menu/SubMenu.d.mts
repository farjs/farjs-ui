export default SubMenu;
export type SubMenuProps = {
    readonly selected: number;
    readonly items: string[];
    readonly top: number;
    readonly left: number;
    onClick(index: number): void;
};
/**
 * @typedef {{
 *  readonly selected: number;
 *  readonly items: string[];
 *  readonly top: number;
 *  readonly left: number;
 *  onClick(index: number): void;
 * }} SubMenuProps
 */
/**
 * @param {SubMenuProps} props
 */
declare function SubMenu(props: SubMenuProps): React.ReactElement<{
    clickable: boolean;
    autoFocus: boolean;
    width: number;
    height: number;
    top: number;
    left: number;
    shadow: boolean;
    style: import("../theme/Theme.mjs").ThemeEffects;
}, string | React.JSXElementConstructor<any>>;
declare namespace SubMenu {
    export const displayName: string;
    export { DoubleBorder as doubleBorderComp };
    export { HorizontalLine as horizontalLineComp };
    export const separator: string;
}
import React from "react";
import DoubleBorder from "../border/DoubleBorder.mjs";
import HorizontalLine from "../border/HorizontalLine.mjs";
