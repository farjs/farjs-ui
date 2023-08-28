/**
 * @typedef {import("../../src/ButtonsPanel").ButtonsPanelAction} ButtonsPanelAction
 * @typedef {import("./MessageBox").MessageBoxProps} MessageBoxProps
 */
import React from "react";
import * as UI from "../UI.mjs";
import TextAlign from "../TextAlign.mjs";
import TextLine from "../TextLine.mjs";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";
import ButtonsPanel from "../ButtonsPanel.mjs";

const h = React.createElement;

/**
 * @param {MessageBoxProps} props
 */
const MessageBox = (props) => {
  const { popupComp, modalContentComp, textLineComp, buttonsPanelComp } =
    MessageBox;

  const width = 60;
  const textWidth = width - (ModalContent.paddingHorizontal + 2) * 2;
  const textLines = UI.splitText(props.message, textWidth);
  const height = (ModalContent.paddingVertical + 1) * 2 + textLines.length + 1;
  const onClose = props.actions.find((a) => a.triggeredOnClose)?.onAction;

  /** @type {ButtonsPanelAction[]} */
  const actions = props.actions.map((action) => {
    return {
      label: action.label,
      onAction: action.onAction,
    };
  });

  return h(
    popupComp,
    {
      onClose,
    },
    h(
      modalContentComp,
      {
        title: props.title,
        width: width,
        height: height,
        style: props.style,
      },
      [
        ...textLines.map((text, index) => {
          return h(textLineComp, {
            key: `${index}`,
            align: TextAlign.center,
            left: 2,
            top: 1 + index,
            width: textWidth,
            text: text,
            style: props.style,
            padding: 0,
          });
        }),

        h(buttonsPanelComp, {
          key: `buttonsPanelComp`,
          top: 1 + textLines.length,
          actions: actions,
          style: props.style,
          padding: 1,
        }),
      ]
    )
  );
};

MessageBox.displayName = "MessageBox";
MessageBox.popupComp = Popup;
MessageBox.modalContentComp = ModalContent;
MessageBox.textLineComp = TextLine;
MessageBox.buttonsPanelComp = ButtonsPanel;

export default MessageBox;
