/**
 * @typedef {import("./MenuPopup").MenuPopupProps} MenuPopupProps
 */
import React from "react";
import Theme from "../theme/Theme.mjs";
import Popup from "../popup/Popup.mjs";
import ModalContent from "../popup/ModalContent.mjs";
import Button from "../Button.mjs";

const h = React.createElement;

const paddingHorizontal = 2;
const paddingVertical = 1;

/**
 * @param {MenuPopupProps} props
 */
const MenuPopup = (props) => {
  const { popupComp, modalContentComp, buttonComp } = MenuPopup;

  const textWidth = props.items.reduce((_1, _2) => Math.max(_1, _2.length), 0);
  const width = textWidth + (paddingHorizontal + 1) * 2;
  const height = (paddingVertical + 1) * 2 + props.items.length;
  const theme = Theme.useTheme().popup.menu;

  return h(
    popupComp,
    {
      onClose: props.onClose,
    },
    h(
      modalContentComp,
      {
        title: props.title,
        width,
        height,
        style: theme,
        padding: MenuPopup.padding,
        left: props.getLeft(width),
      },
      ...props.items.map((text, index) => {
        return h(buttonComp, {
          key: `${index}`,
          left: 1,
          top: 1 + index,
          label: text,
          style: theme,
          onPress: () => {
            props.onSelect(index);
          },
        });
      })
    )
  );
};

MenuPopup.displayName = "MenuPopup";
MenuPopup.popupComp = Popup;
MenuPopup.modalContentComp = ModalContent;
MenuPopup.buttonComp = Button;

MenuPopup.padding = {
  left: paddingHorizontal,
  right: paddingHorizontal,
  top: paddingVertical,
  bottom: paddingVertical,
};

/**
 * @param {number} stackWidth
 * @param {boolean} showOnLeft
 * @param {number} width
 * @returns {string}
 */
MenuPopup.getLeftPos = (stackWidth, showOnLeft, width) => {
  const pos =
    width <= stackWidth
      ? Math.trunc((stackWidth - width) / 2)
      : stackWidth - width;
  const [left, normalizedPos] =
    showOnLeft || width > stackWidth * 2
      ? ["0%", Math.max(pos, 0)]
      : ["50%", pos];

  return normalizedPos >= 0
    ? `${left}+${normalizedPos}`
    : `${left}${normalizedPos}`;
};

export default MenuPopup;
