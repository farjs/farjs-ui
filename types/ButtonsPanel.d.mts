export default ButtonsPanel;
export type ButtonsPanelAction = {
    readonly label: string;
    onAction(): void;
};
export type ButtonsPanelProps = {
    readonly top: number;
    readonly actions: readonly ButtonsPanelAction[];
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    readonly padding?: number;
    readonly margin?: number;
};
/**
 * @typedef {{
 *  readonly label: string;
 *  onAction(): void;
 * }} ButtonsPanelAction
 */
/**
 * @typedef {{
 *  readonly top: number;
 *  readonly actions: readonly ButtonsPanelAction[];
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly padding?: number;
 *  readonly margin?: number;
 * }} ButtonsPanelProps
 */
/**
 * @param {ButtonsPanelProps} props
 */
declare function ButtonsPanel(props: ButtonsPanelProps): React.ReactElement<{
    width: number;
    height: number;
    left: string;
    top: number;
    style: import("blessed").Widgets.Types.TStyle;
}, string | React.JSXElementConstructor<any>>;
declare namespace ButtonsPanel {
    export let displayName: string;
    export { Button as buttonComp };
}
import React from "react";
import Button from "./Button.mjs";
