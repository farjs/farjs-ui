export default StatusPopup;
export type StatusPopupProps = {
    readonly text: string;
    readonly title?: string;
    onClose?(): void;
};
/**
 * @typedef {{
 *  readonly text: string;
 *  readonly title?: string;
 *  onClose?(): void;
 * }} StatusPopupProps
 */
/**
 * @param {StatusPopupProps} props
 */
declare function StatusPopup(props: StatusPopupProps): React.FunctionComponentElement<import("./Popup.mjs").PopupProps>;
declare namespace StatusPopup {
    export let displayName: string;
    export { Popup as popupComp };
    export { ModalContent as modalContentComp };
    export { TextLine as textLineComp };
}
import React from "react";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";
import TextLine from "../TextLine.mjs";
