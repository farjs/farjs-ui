/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg & {
 *    defaultPrevented?: boolean
 * }} IKeyEventArg
 * @typedef {import("@farjs/blessed").Widgets.Events.IMouseEventArg} MouseEvent
 * @typedef {import("./UiString").UiString} UiString
 * @typedef {import("./TextInput").TextInputProps} TextInputProps
 * @typedef {import("./TextInput").TextInputState} TextInputState
 * @typedef {import("./TextInput").CursorMove} CursorMove
 * @typedef {import("./TextInput").TextEdit} TextEdit
 */
import React, { useLayoutEffect, useRef } from "react";
import { renderText2 } from "./UI.mjs";
import UiString from "./UiString.mjs";
import Theme from "./theme/Theme.mjs";

const h = React.createElement;

/**
 * @typedef {"Reset" | "All" | "TillTheHome" | "TillTheEnd" | "ToTheLeft" | "ToTheRight"} TextSelect
 * @typedef {{value: string, cm: CursorMove}} EditResult
 */

/**
 * @param {number} point
 * @returns {boolean}
 */
function isHighSurrogate(point) {
  return point >= 0xd800 && point <= 0xdbff;
}

/**
 * @param {number} point
 * @returns {boolean}
 */
function isLowSurrogate(point) {
  return point >= 0xdc00 && point <= 0xdfff;
}

/**
 * @param {TextInputProps} props
 */
const TextInput = (props) => {
  const insertHighSurrogate = useRef("");
  const theme = Theme.useTheme().textBox;
  const elementRef = props.inputRef;
  const { offset, cursorX, selStart, selEnd } = props.state;
  const currValue = UiString(props.value);

  useLayoutEffect(() => {
    move(elementRef.current, currValue, { move: "End" }, "All");
  }, []);

  /**
   * @param {BlessedElement} el
   * @param {UiString} value
   * @param {CursorMove} cm
   * @param {TextSelect} ts
   */
  function move(el, value, cm, ts) {
    const charStart = value.charStartPos(offset + cursorX);
    const [posX, idx] = (() => {
      //prettier-ignore
      switch (cm.move) {
        case "At":   return [cm.pos, offset];
        case "Home": return [0, 0];
        case "End":  return [value.strWidth(), value.strWidth() - /** @type {number} */ (el.width) + 1];
        case "Left":
          const ldx = cm.dx ?? Math.max(charStart.lcw, 1);
          return [cursorX - ldx, cursorX === 0 ? offset - ldx : offset];
        case "Right":
          const rdx = cm.dx ?? Math.max(charStart.rcw, 1);
          return [cursorX + rdx, cursorX === /** @type {number} */ (el.width) - 1 ? offset + rdx : offset];
      }
    })();

    const newOffset = Math.min(Math.max(idx, 0), value.strWidth());

    const newPos = Math.min(
      Math.max(posX, 0),
      Math.min(
        Math.max(/** @type {number} */ (el.width) - 1, 0),
        Math.max(value.strWidth() - newOffset, 0)
      )
    );
    if (newPos !== cursorX) {
      el.screen.program.omove(
        /** @type {number} */ (el.aleft) + newPos,
        /** @type {number} */ (el.atop)
      );
    }

    select(value, charStart.pos, newOffset + newPos, ts);
    props.stateUpdater((state) => {
      return { ...state, offset: newOffset, cursorX: newPos };
    });
  }

  /**
   * @param {UiString} value
   * @param {number} idx
   * @param {number} newIdx
   * @param {TextSelect} ts
   */
  function select(value, idx, newIdx, ts) {
    const selStartOrIdx = () => (selStart !== -1 ? selStart : idx);
    const selEndOrIdx = () => (selEnd !== -1 ? selEnd : idx);
    const [newStart, newEnd] = (() => {
      //prettier-ignore
      switch (ts) {
        case "Reset":       return [-1, -1];
        case "All":         return [0, value.strWidth()];
        case "TillTheEnd":  return [selStartOrIdx(), value.strWidth()];
        case "ToTheRight":  return [selStartOrIdx(), newIdx];
        case "TillTheHome": return [0, selEndOrIdx()];
        case "ToTheLeft":   return [newIdx, selEndOrIdx()];
      }
    })();

    props.stateUpdater((state) => {
      return { ...state, selStart: newStart, selEnd: newEnd };
    });
  }

  /**
   * @param {MouseEvent} data
   */
  //prettier-ignore
  function onClick(data) {
    const el = elementRef.current;
    const screen = el.screen;
    move(el, currValue, { move: "At", pos: data.x - /** @type {number} */ (el.aleft) }, "Reset");
    if (screen.focused !== el) {
      el.focus();
    }
  }

  function onResize() {
    const el = elementRef.current;
    const screen = el.screen;
    if (screen.focused === el) {
      screen.program.omove(
        /** @type {number} */ (el.aleft) + cursorX,
        /** @type {number} */ (el.atop)
      );
    }
  }

  function onFocus() {
    const el = elementRef.current;
    const screen = el.screen;
    const cursor = screen.cursor;
    if (cursor.shape !== "underline" || !cursor.blink) {
      // @ts-ignore
      screen.cursorShape("underline", true);
    }

    screen.program.showCursor();
  }

  function onBlur() {
    const el = elementRef.current;
    el.screen.program.hideCursor();
  }

  /**
   * @param {UiString} value
   * @param {TextEdit} te
   * @returns {EditResult}
   */
  function edit(value, te) {
    /**
     * @returns {EditResult}
     */
    function doEdit() {
      //prettier-ignore
      if (selEnd - selStart > 0) {
        switch (te.edit) {
          case "Delete":
          case "Backspace":
            return {
              value: value.slice(0, selStart) + value.slice(selEnd, value.strWidth()),
              cm: { move: "At", pos: selStart - offset },
            };
          case "Insert":
            return {
              value: value.slice(0, selStart) + te.str + value.slice(selEnd, value.strWidth()),
              cm: { move: "At", pos: selStart + te.str.strWidth() - offset },
            };
        }
      } else {
        const idx = offset + cursorX;
        const charStart = value.charStartPos(idx);
        switch (te.edit) {
          case "Delete":
            return {
              value: value.slice(0, idx) + value.slice(idx + charStart.rcw, value.strWidth()),
              cm: { move: "At", pos: cursorX },
            };
          case "Backspace":
            return {
              value: value.slice(0, idx - 1) + value.slice(idx, value.strWidth()),
              cm: { move: "Left", dx: charStart.lcw },
            };
          case "Insert":
            return {
              value: value.slice(0, idx) + te.str + value.slice(idx, value.strWidth()),
              cm: { move: "Right", dx: te.str.strWidth() },
            };
        }
      }
    }

    const res = doEdit();
    if (value.toString() !== res.value) {
      props.onChange(res.value);
    }
    return res;
  }

  /**
   * @param {object | null | undefined} ch
   * @param {IKeyEventArg} key
   */
  function onKeypress(ch, key) {
    const el = elementRef.current;

    /**
     * @param {TextEdit} te
     */
    function remove(te) {
      const { value: newVal, cm: cursorMove } = edit(currValue, te);
      if (currValue.toString() !== newVal) {
        move(el, UiString(newVal), cursorMove, "Reset");
      }
    }

    let processed = true;
    if (!props.onKeypress?.call(null, key.full)) {
      //prettier-ignore
      switch (key.full) {
        case "return": props.onEnter?.call(null); break;
        case "enter": break; // either enter or return is handled, not both!
        case "escape":
        case "tab": processed = false; break;
        case "right":   move(el, currValue, { move: "Right" }, "Reset"); break;
        case "S-right": move(el, currValue, { move: "Right" }, "ToTheRight"); break;
        case "left":    move(el, currValue, { move: "Left" }, "Reset"); break;
        case "S-left":  move(el, currValue, { move: "Left" }, "ToTheLeft"); break;
        case "home":    move(el, currValue, { move: "Home" }, "Reset"); break;
        case "S-home":  move(el, currValue, { move: "Home" }, "TillTheHome"); break;
        case "end":     move(el, currValue, { move: "End" }, "Reset"); break;
        case "S-end":   move(el, currValue, { move: "End" }, "TillTheEnd"); break;
        case "C-a":     move(el, currValue, { move: "End" }, "All"); break;
        case "C-c":
        case "C-x":
          if (selEnd - selStart > 0) {
            el.screen.copyToClipboard(currValue.slice(selStart, selEnd));
            if (key.full === "C-x") {
              remove({ edit: "Delete" });
            }
          }
          break;
        case "delete":    remove({ edit: "Delete" }); break;
        case "backspace": remove({ edit: "Backspace" }); break;
        default:
          const str = ch?.toString();
          if (str && str.length > 0) {
            const code = str.charCodeAt(0);
            if (isHighSurrogate(code)) insertHighSurrogate.current = str;
            else {
              const combined = isLowSurrogate(code) ? insertHighSurrogate.current + str : str;
              insertHighSurrogate.current = "";
              
              const { value: newVal, cm: cursorMove } = edit(currValue, { edit: "Insert", str: UiString(combined) });
              move(el, UiString(newVal), cursorMove, "Reset");
            }
          } else processed = false;
          break;
      }
    }

    key.defaultPrevented = processed;
  }

  //prettier-ignore
  function renderContent() {
    if (selEnd - selStart > 0) {
      const part1 = renderText2(theme.regular, currValue.slice(offset, selStart));
      const part2 = renderText2(theme.selected, currValue.slice(Math.max(selStart, offset), selEnd));
      const part3 = renderText2(theme.regular, currValue.slice(selEnd, currValue.strWidth()));
      return `${part1}${part2}${part3}`;
    }
    return renderText2(theme.regular, currValue.slice(offset, currValue.strWidth()));
  }

  return h("input", {
    ref: elementRef,
    autoFocus: false,
    clickable: true,
    keyable: true,
    width: props.width,
    height: 1,
    left: props.left,
    top: props.top,
    style: theme.regular,
    wrap: false,
    tags: true,
    content: renderContent(),
    onClick,
    onResize,
    onFocus,
    onBlur,
    onKeypress,
  });
};

TextInput.displayName = "TextInput";

/**
 * @returns {TextInputState}
 */
TextInput.createState = () => {
  return {
    offset: 0,
    cursorX: -1,
    selStart: -1,
    selEnd: -1,
  };
};

export default TextInput;
