/**
 * @typedef {import("./ModalContent").BlessedPadding} BlessedPadding
 * @typedef {import("./ListPopup").ListPopupProps} ListPopupProps
 */
import React from "react";
import Theme from "../theme/Theme.mjs";
import Popup from "./Popup.mjs";
import ModalContent from "./ModalContent.mjs";
import WithSize from "../WithSize.mjs";
import ListBox from "../ListBox.mjs";
import TextLine from "../TextLine.mjs";

const h = React.createElement;

/**
 * @param {ListPopupProps} props
 */
const ListPopup = (props) => {
  const { popupComp, modalContentComp, withSizeComp, listBoxComp } = ListPopup;

  const items = props.items;
  const theme = Theme.useTheme().popup.menu;
  const textPaddingLeft = props.textPaddingLeft ?? 2;
  const textPaddingRight = props.textPaddingRight ?? 1;
  const itemWrapPrefixLen = props.itemWrapPrefixLen ?? 3;
  const textPaddingLen = textPaddingLeft + textPaddingRight;
  const textPaddingLeftStr = " ".repeat(textPaddingLeft);
  const textPaddingRightStr = " ".repeat(textPaddingRight);

  return h(
    popupComp,
    {
      onClose: props.onClose,
      onKeypress: props.onKeypress,
    },
    h(withSizeComp, {
      render: (width, height) => {
        const maxContentWidth =
          items.length === 0
            ? 2 * (ListPopup.paddingHorizontal + 1)
            : items.reduce((_1, _2) => Math.max(_1, _2.length), 0) +
              2 * (ListPopup.paddingHorizontal + 1);

        const maxContentHeight =
          items.length + 2 * (ListPopup.paddingVertical + 1);

        const modalWidth = Math.min(
          Math.max(minWidth, maxContentWidth + textPaddingLen),
          Math.max(minWidth, width)
        );
        const modalHeight = Math.min(
          Math.max(minHeight, maxContentHeight),
          Math.max(minHeight, height - 4)
        );

        const contentWidth = modalWidth - 2 * (ListPopup.paddingHorizontal + 1); // padding + border
        const contentHeight = modalHeight - 2 * (ListPopup.paddingVertical + 1);

        return h(
          modalContentComp,
          {
            title: props.title,
            width: modalWidth,
            height: modalHeight,
            style: theme,
            padding: ListPopup.padding,
            footer: props.footer,
          },
          h(listBoxComp, {
            left: 1,
            top: 1,
            width: contentWidth,
            height: contentHeight,
            selected: props.selected ?? 0,
            items: items.map((item) => {
              return (
                textPaddingLeftStr +
                TextLine.wrapText(
                  item,
                  contentWidth - textPaddingLen,
                  itemWrapPrefixLen
                ) +
                textPaddingRightStr
              );
            }),
            style: theme,
            onAction: (index) => {
              if (items.length > 0) {
                props.onAction(index);
              }
            },
            onSelect: props.onSelect,
          })
        );
      },
    })
  );
};

ListPopup.displayName = "ListPopup";
ListPopup.popupComp = Popup;
ListPopup.modalContentComp = ModalContent;
ListPopup.withSizeComp = WithSize;
ListPopup.listBoxComp = ListBox;

ListPopup.paddingHorizontal = 2;
ListPopup.paddingVertical = 1;

const minWidth = 50 + 2 * (ListPopup.paddingHorizontal + 1); // padding + border
const minHeight = 10 + 2 * (ListPopup.paddingVertical + 1);

/** @type {BlessedPadding} */
ListPopup.padding = {
  left: ListPopup.paddingHorizontal,
  right: ListPopup.paddingHorizontal,
  top: ListPopup.paddingVertical,
  bottom: ListPopup.paddingVertical,
};

export default ListPopup;
