export default Popup;
export type PopupProps = {
    readonly focusable?: boolean | undefined;
    onClose?(): void;
    onOpen?(): void;
    onKeypress?(keyFull: string): boolean;
};
/**
 * @typedef {{
 *  readonly focusable?: boolean;
 *  onClose?(): void;
 *  onOpen?(): void;
 *  onKeypress?(keyFull: string): boolean;
 * }} PopupProps
 */
/**
 * @param {React.PropsWithChildren<PopupProps>} props
 */
declare function Popup(props: React.PropsWithChildren<PopupProps>): React.FunctionComponentElement<{}>;
declare namespace Popup {
    export const displayName: string;
    export { Portal as portalComp };
    export { PopupOverlay as popupOverlayComp };
}
import React from "react";
import Portal from "../portal/Portal.mjs";
import PopupOverlay from "./PopupOverlay.mjs";
