export default MenuBar;
export type ButtonsPanelAction = import("../../src/ButtonsPanel.mjs").ButtonsPanelAction;
export type MenuBarItem = {
    readonly label: string;
    readonly subItems: string[];
};
export type MenuBarProps = {
    readonly items: MenuBarItem[];
    onAction(menuIndex: number, subIndex: number): void;
    onClose(): void;
};
export type SubMenuState = {
    readonly menuIndex: number;
    readonly subIndex: number;
};
/**
 * @typedef {{
 *  readonly label: string;
 *  readonly subItems: string[];
 * }} MenuBarItem
 */
/**
 * @typedef {{
 *  readonly items: MenuBarItem[];
 *  onAction(menuIndex: number, subIndex: number): void;
 *  onClose(): void;
 * }} MenuBarProps
 */
/**
 * @typedef {{
 *  readonly menuIndex: number;
 *  readonly subIndex: number;
 * }} SubMenuState
 */
/**
 * @param {MenuBarProps} props
 */
declare function MenuBar(props: MenuBarProps): React.FunctionComponentElement<{}>;
declare namespace MenuBar {
    export const displayName: string;
    export { Popup as popupComp };
    export { ButtonsPanel as buttonsPanel };
    export { SubMenu as subMenuComp };
}
import React from "react";
import Popup from "../popup/Popup.mjs";
import ButtonsPanel from "../ButtonsPanel.mjs";
import SubMenu from "./SubMenu.mjs";
