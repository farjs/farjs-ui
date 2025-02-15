export default CheckBox;
export type CheckBoxProps = {
    readonly left: number;
    readonly top: number;
    readonly value: boolean;
    readonly label: string;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    onChange(): void;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly value: boolean;
 *  readonly label: string;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  onChange(): void;
 * }} CheckBoxProps
 */
/**
 * @param {CheckBoxProps} props
 */
declare function CheckBox(props: CheckBoxProps): React.FunctionComponentElement<{}>;
declare namespace CheckBox {
    export let displayName: string;
    export { Button as buttonComp };
}
import React from "react";
import Button from "./Button.mjs";
