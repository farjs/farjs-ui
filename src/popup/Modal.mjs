/**
 * @typedef {import("./Modal").ModalProps} ModalProps
 */
import React from "react";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";

const h = React.createElement;

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
