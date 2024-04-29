/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("@farjs/blessed").Widgets.FormElement<any> & {
 *    focusFirst(): void,
 *    _selected: BlessedElement
 * }} FormElement
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg & {
 *    defaultPrevented?: boolean
 * }} IKeyEventArg
 * @typedef {import("./Popup.mjs").PopupProps} PopupProps
 */
import React, { useLayoutEffect, useRef } from "react";

const h = React.createElement;

/**
 * @param {React.PropsWithChildren<PopupProps>} props
 * @returns {React.ReactElement}
 */
const PopupOverlay = (props) => {
  const formRef = /** @type {React.MutableRefObject<FormElement>} */ (useRef());

  useLayoutEffect(() => {
    if (props.focusable ?? true) {
      formRef.current.focusFirst();
    }

    props.onOpen?.apply(null);
  }, []);

  useLayoutEffect(() => {
    const form = formRef.current;
    /** @type {(el: BlessedElement, ch: any, key: IKeyEventArg) => void} */
    const keyListener = (_1, _2, key) => {
      if (
        !(key.defaultPrevented ?? false) &&
        !(props.onKeypress?.apply(null, [key.full]) ?? false)
      ) {
        switch (key.full) {
          case "escape":
            props.onClose?.apply(null);
            break;
          case "tab":
          case "down":
          case "right":
            form.focusNext();
            break;
          case "S-tab":
          case "up":
          case "left":
            form.focusPrevious();
            break;
          default:
            break;
        }
      }
    };
    /** @type {(el: BlessedElement) => void} */
    const focusListener = (el) => {
      form._selected = el;
    };

    form.on("element keypress", keyListener);
    form.on("element focus", focusListener);
    return () => {
      form.off("element keypress", keyListener);
      form.off("element focus", focusListener);
    };
  }, [props.onClose, props.onKeypress]);

  return h(
    "form",
    {
      ref: formRef,
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: PopupOverlay.style,
      onClick: () => {
        props.onClose?.apply(null);
      },
    },
    props.children
  );
};

PopupOverlay.displayName = "PopupOverlay";
/**
 * @type {import("@farjs/blessed").Widgets.Types.TStyle}
 */
PopupOverlay.style = {
  transparent: true,
};

export default PopupOverlay;
