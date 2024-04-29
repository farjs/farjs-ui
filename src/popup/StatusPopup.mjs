import React from "react";
import * as UI from "../UI.mjs";
import TextAlign from "../TextAlign.mjs";
import TextLine from "../TextLine.mjs";
import Theme from "../theme/Theme.mjs";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";

const h = React.createElement;

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
const StatusPopup = (props) => {
  const { popupComp, modalContentComp, textLineComp } = StatusPopup;

  const width = 35;
  const textWidth = width - (ModalContent.paddingHorizontal + 2) * 2;
  const textLines = UI.splitText(props.text, textWidth);
  const height = (ModalContent.paddingVertical + 1) * 2 + textLines.length;
  const theme = Theme.useTheme().popup.regular;
  const style = {
    bold: theme.bold,
    bg: theme.bg,
    fg: theme.fg,
  };

  return h(
    popupComp,
    {
      onClose: props.onClose,
    },
    h(
      modalContentComp,
      {
        title: props.title ?? "Status",
        width: width,
        height: height,
        style: style,
      },
      h(
        "button",
        {
          width: textWidth,
          height: textLines.length,
          left: 2,
          top: 1,
          style: style,
        },
        [
          ...textLines.map((text, index) => {
            return h(textLineComp, {
              key: `${index}`,
              align: TextAlign.center,
              left: 0,
              top: index,
              width: textWidth,
              text: text,
              style: style,
              padding: 0,
            });
          }),
        ]
      )
    )
  );
};

StatusPopup.displayName = "StatusPopup";
StatusPopup.popupComp = Popup;
StatusPopup.modalContentComp = ModalContent;
StatusPopup.textLineComp = TextLine;

export default StatusPopup;
