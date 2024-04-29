import React from "react";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";

const h = React.createElement;

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
const Modal = (props) => {
  const { popupComp, modalContentComp } = Modal;

  return h(
    popupComp,
    {
      onClose: props.onCancel,
    },
    h(
      modalContentComp,
      {
        title: props.title,
        width: props.width,
        height: props.height,
        style: props.style,
      },
      props.children
    )
  );
};

Modal.displayName = "Modal";
Modal.popupComp = Popup;
Modal.modalContentComp = ModalContent;

export default Modal;
