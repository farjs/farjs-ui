export default ListPopup;
export type BlessedPadding = import("./ModalContent.mjs").BlessedPadding;
export type ListPopupProps = {
    readonly title: string;
    readonly items: readonly string[];
    onAction(index: number): void;
    onClose(): void;
    readonly selected?: number;
    onSelect?(index: number): void;
    onKeypress?(keyFull: string): boolean;
    readonly footer?: string;
    readonly textPaddingLeft?: number;
    readonly textPaddingRight?: number;
    readonly itemWrapPrefixLen?: number;
};
/**
 * @typedef {{
 *  readonly title: string;
 *  readonly items: readonly string[];
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
    export let displayName: string;
    export { Popup as popupComp };
    export { ModalContent as modalContentComp };
    export { WithSize as withSizeComp };
    export { ListBox as listBoxComp };
    export let paddingHorizontal: number;
    export let paddingVertical: number;
    export let padding: BlessedPadding;
}
import React from "react";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";
import WithSize from "../WithSize.mjs";
import ListBox from "../ListBox.mjs";
