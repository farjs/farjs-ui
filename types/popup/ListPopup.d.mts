export default ListPopup;
export type BlessedPadding = import("./ModalContent.mjs").BlessedPadding;
export type ListPopupProps = {
    readonly title: string;
    readonly items: string[];
    onAction(index: number): void;
    onClose(): void;
    readonly selected?: number | undefined;
    onSelect?(index: number): void;
    onKeypress?(keyFull: string): boolean;
    readonly footer?: string | undefined;
    readonly textPaddingLeft?: number | undefined;
    readonly textPaddingRight?: number | undefined;
    readonly itemWrapPrefixLen?: number | undefined;
};
/**
 * @typedef {{
 *  readonly title: string;
 *  readonly items: string[];
 *  onAction(index: number): void;
 *  onClose(): void;
 *  readonly selected?: number;
 *  onSelect?(index: number): void;
 *  onKeypress?(keyFull: string): boolean;
 *  readonly footer?: string;
 *  readonly textPaddingLeft?: number;
 *  readonly textPaddingRight?: number;
 *  readonly itemWrapPrefixLen?: number;
 * }} ListPopupProps
 */
/**
 * @param {ListPopupProps} props
 */
declare function ListPopup(props: ListPopupProps): React.FunctionComponentElement<import("./Popup.mjs").PopupProps>;
declare namespace ListPopup {
    export const displayName: string;
    export { Popup as popupComp };
    export { ModalContent as modalContentComp };
    export { WithSize as withSizeComp };
    export { ListBox as listBoxComp };
    export const paddingHorizontal: number;
    export const paddingVertical: number;
    export const padding: BlessedPadding;
}
import React from "react";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";
import WithSize from "../WithSize.mjs";
import ListBox from "../ListBox.mjs";
