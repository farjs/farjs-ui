export default Modal;
export type ModalProps = {
    readonly title: string;
    readonly width: number;
    readonly height: number;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    onCancel(): void;
};
/**
 * @typedef {{
 *  readonly title: string;
 *  readonly width: number;
 *  readonly height: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  onCancel(): void;
 * }} ModalProps
 */
/**
 * @param {React.PropsWithChildren<ModalProps>} props
 */
declare function Modal(props: React.PropsWithChildren<ModalProps>): React.FunctionComponentElement<import("./Popup.mjs").PopupProps>;
declare namespace Modal {
    export let displayName: string;
    export { Popup as popupComp };
    export { ModalContent as modalContentComp };
}
import React from "react";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";
