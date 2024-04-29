export default MenuPopup;
export type MenuPopupProps = {
    readonly title: string;
    readonly items: string[];
    getLeft(width: number): string;
    onSelect(index: number): void;
    onClose(): void;
};
/**
 * @typedef {{
 *  readonly title: string;
 *  readonly items: string[];
 *  getLeft(width: number): string;
 *  onSelect(index: number): void;
 *  onClose(): void;
 * }} MenuPopupProps
 */
/**
 * @param {MenuPopupProps} props
 */
declare function MenuPopup(props: MenuPopupProps): React.FunctionComponentElement<import("../popup/Popup.mjs").PopupProps>;
declare namespace MenuPopup {
    export const displayName: string;
    export { Popup as popupComp };
    export { ModalContent as modalContentComp };
    export { Button as buttonComp };
    export namespace padding {
        export { paddingHorizontal as left };
        export { paddingHorizontal as right };
        export { paddingVertical as top };
        export { paddingVertical as bottom };
    }
    /**
     * @param {number} stackWidth
     * @param {boolean} showOnLeft
     * @param {number} width
     * @returns {string}
     */
    export function getLeftPos(stackWidth: number, showOnLeft: boolean, width: number): string;
}
import React from "react";
import Popup from "../popup/Popup.mjs";
import ModalContent from "../popup/ModalContent.mjs";
import Button from "../Button.mjs";
declare const paddingHorizontal: 2;
declare const paddingVertical: 1;
