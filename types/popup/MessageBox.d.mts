export default MessageBox;
export type ButtonsPanelAction = import("../../src/ButtonsPanel.mjs").ButtonsPanelAction;
export type MessageBoxAction = import("./MessageBoxAction.mjs").MessageBoxAction;
export type MessageBoxProps = {
    readonly title: string;
    readonly message: string;
    readonly actions: readonly MessageBoxAction[];
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
};
/**
 * @typedef {{
 *  readonly title: string;
 *  readonly message: string;
 *  readonly actions: readonly MessageBoxAction[];
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 * }} MessageBoxProps
 */
/**
 * @param {MessageBoxProps} props
 */
declare function MessageBox(props: MessageBoxProps): React.FunctionComponentElement<import("./Popup.mjs").PopupProps>;
declare namespace MessageBox {
    export let displayName: string;
    export { Popup as popupComp };
    export { ModalContent as modalContentComp };
    export { TextLine as textLineComp };
    export { ButtonsPanel as buttonsPanelComp };
}
import React from "react";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";
import TextLine from "../TextLine.mjs";
import ButtonsPanel from "../ButtonsPanel.mjs";
