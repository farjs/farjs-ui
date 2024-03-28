/**
 * @typedef {import("@farjs/blessed").BlessedProgram} BlessedProgram
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("./ListViewport").ListViewport} ListViewport
 * @typedef {import("./TextInput").TextInputState} TextInputState
 * @typedef {import("./ComboBox").ComboBoxProps} ComboBoxProps
 */
import React, { useRef, useState } from "react";
import { createListViewport } from "./ListViewport.mjs";
import PopupOverlay from "./popup/PopupOverlay.mjs";
import Theme from "./theme/Theme.mjs";
import TextInput from "./TextInput.mjs";
import ComboBoxPopup from "./ComboBoxPopup.mjs";

const h = React.createElement;

/**
 * @param {ComboBoxProps} props
 */
const ComboBox = (props) => {
  const { textInputComp, comboBoxPopup } = ComboBox;

  const inputRef = /** @type {React.MutableRefObject<BlessedElement>} */ (
    useRef()
  );
  const programRef =
    /** @type {React.MutableRefObject<BlessedProgram | null>} */ (useRef(null));
  const autoCompleteTimeoutRef =
    /** @type {React.MutableRefObject<NodeJS.Timeout | null>} */ (useRef(null));

  const [maybePopup, setPopup] = useState(
    /** @type {ListViewport | null} */ (null)
  );
  const [state, setState] = useState(
    /** @type {TextInputState} */ (TextInput.createState())
  );
  const currTheme = Theme.useTheme();
  const theme = currTheme.popup.menu;
  const arrowStyle = currTheme.popup.regular;

  function showOrHidePopup() {
    if (maybePopup) hidePopup();
    else {
      showPopup(
        createListViewport(0, props.items.length, ComboBoxPopup.maxItems)
      );
    }
  }

  /** @type {(viewport: ListViewport) => void} */
  function showPopup(viewport) {
    setPopup(viewport);

    if (programRef.current) {
      programRef.current.hideCursor();
    }
  }

  function hidePopup() {
    setPopup(null);

    if (programRef.current) {
      programRef.current.showCursor();
    }
  }

  /** @type {(offset: number, index: number) => void} */
  function onSelectAction(offset, index) {
    if (props.items.length > 0) {
      props.onChange(props.items[offset + index]);
      hidePopup();

      process.stdin.emit("keypress", undefined, {
        name: "end",
        ctrl: false,
        meta: false,
        shift: false,
      });
    }
  }

  /** @type {(key: string) => void} */
  function onAutoCompleteAction(key) {
    const value =
      state.selStart !== -1
        ? props.value.slice(0, Math.min(state.selStart, props.value.length))
        : props.value;

    const newValue = (() => {
      if (key.length === 1) return `${value}${key}`;
      if (key.startsWith("S-") && key.length > 2) {
        return `${value}${key.slice(2).toUpperCase()}`;
      }
      if (key === "space") return `${value} `;
      return value;
    })();

    if (newValue !== value) {
      if (autoCompleteTimeoutRef.current) {
        global.clearTimeout(autoCompleteTimeoutRef.current);
        autoCompleteTimeoutRef.current = null;
      }

      const existing = props.items.find((_) => _.startsWith(newValue));
      if (existing) {
        autoCompleteTimeoutRef.current = global.setTimeout(() => {
          props.onChange(existing);

          process.stdin.emit("keypress", undefined, {
            name: "end",
            ctrl: false,
            meta: false,
            shift: true,
          });
        }, 25);
      }
    }
  }

  /** @type {(keyFull: string) => boolean} */
  const onKeypress = (keyFull) => {
    let processed = !!maybePopup;
    switch (keyFull) {
      case "escape":
      case "tab":
        hidePopup();
        break;
      case "C-up":
      case "C-down":
        showOrHidePopup();
        processed = true;
        break;
      case "return":
        if (maybePopup) {
          onSelectAction(maybePopup.offset, maybePopup.focused);
        }
        break;
      default:
        if (maybePopup) {
          const vp = maybePopup.onKeypress(keyFull);
          if (vp) {
            setPopup(vp);
          }
        } else onAutoCompleteAction(keyFull);
        break;
    }

    return processed;
  };

  return h(
    React.Fragment,
    null,

    h(textInputComp, {
      inputRef: inputRef,
      left: props.left,
      top: props.top,
      width: props.width,
      value: props.value,
      state,
      stateUpdater: setState,
      onChange: props.onChange,
      onEnter: props.onEnter,
      onKeypress,
    }),

    h("text", {
      width: 1,
      height: 1,
      left: props.left + props.width,
      top: props.top,
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: arrowStyle,
      onClick: () => {
        const el = inputRef.current;
        if (el && el.screen.focused !== el) {
          el.focus();
        }
        showOrHidePopup();
      },
      content: ComboBox.arrowDownCh,
    }),

    maybePopup
      ? h(
          "form",
          {
            /** @type {(el?: BlessedElement) => void} */
            ref: (el) => {
              if (el) {
                programRef.current = el.screen.program;
              }
            },
            clickable: true,
            mouse: true,
            autoFocus: false,
            style: PopupOverlay.style,
            onClick: hidePopup,
          },
          h(comboBoxPopup, {
            left: props.left,
            top: props.top + 1,
            width: props.width,
            items: props.items,
            viewport: maybePopup,
            setViewport: setPopup,
            style: theme,
            onClick: (index) => {
              onSelectAction(0, index);
            },
          })
        )
      : null
  );
};

ComboBox.displayName = "ComboBox";
ComboBox.textInputComp = TextInput;
ComboBox.comboBoxPopup = ComboBoxPopup;

ComboBox.arrowDownCh = "\u2193"; // ↓

export default ComboBox;
