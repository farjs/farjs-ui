/**
 * @typedef {import("./Popup").PopupProps} PopupProps
 */
import React from "react";
import Portal from "../portal/Portal.mjs";
import PopupOverlay from "./PopupOverlay.mjs";

const h = React.createElement;

/**
 * @param {React.PropsWithChildren<PopupProps>} props
 */
const Popup = (props) => {
  const { portalComp, popupOverlayComp } = Popup;

  return h(portalComp, null, h(popupOverlayComp, props, props.children));
};

Popup.displayName = "Popup";
Popup.portalComp = Portal;
Popup.popupOverlayComp = PopupOverlay;

export default Popup;
