export default PopupOverlay;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type FormElement = import("@farjs/blessed").Widgets.FormElement<any> & {
    focusFirst(): void;
    _selected: BlessedElement;
};
export type IKeyEventArg = import("@farjs/blessed").Widgets.Events.IKeyEventArg & {
    defaultPrevented?: boolean;
};
export type PopupProps = import("./Popup.mjs").PopupProps;
/**
 * @param {React.PropsWithChildren<PopupProps>} props
 * @returns {React.ReactElement}
 */
declare function PopupOverlay(props: React.PropsWithChildren<PopupProps>): React.ReactElement;
declare namespace PopupOverlay {
    const displayName: string;
    const style: import("@farjs/blessed").Widgets.Types.TStyle;
}
import React from "react";
