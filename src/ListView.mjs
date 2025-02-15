/**
 * @typedef {import("@farjs/blessed").Widgets.Types.TStyle} BlessedStyle
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("@farjs/blessed").Widgets.Events.IMouseEventArg} MouseEvent
 * @typedef {import("./ListViewport.mjs").ListViewport} ListViewport
 */
import React, { useLayoutEffect, useRef } from "react";
import * as UI from "./UI.mjs";
import UiString from "./UiString.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly width: number;
 *  readonly height: number;
 *  readonly items: readonly string[];
 *  readonly style: BlessedStyle;
 *  readonly viewport: ListViewport;
 *  setViewport(viewport: ListViewport): void;
 *  onClick(index: number): void;
 * }} ListViewProps
 */

/**
 * @param {number} selected
 * @param {readonly string[]} items
 * @param {number} width
 * @param {BlessedStyle} theme
 * @returns {readonly string[]}
 */
function renderItems(selected, items, width, theme) {
  return items.map((item, index) => {
    /** @type {BlessedStyle | undefined} */
    const style = selected === index ? theme.focus : theme;

    const text = UiString(
      item.replace("\n", "").replace("\r", "").replace("\t", " ")
    );

    return UI.renderText2(style, text.ensureWidth(width, " "));
  });
}

/**
 * @param {ListViewProps} props
 */
const ListView = (props) => {
  const elementRef = /** @type {React.MutableRefObject<BlessedElement>} */ (
    useRef()
  );
  const viewport = props.viewport;
  const offset = viewport.offset;
  const focused = viewport.focused;
  const length = viewport.length;
  const viewLength = viewport.viewLength;
  const itemsContent = renderItems(
    focused,
    props.items.slice(offset, offset + viewLength),
    props.width,
    props.style
  ).join("\n");

  useLayoutEffect(() => {
    props.setViewport(viewport.resize(props.height));
  }, [props.height]);

  return h("text", {
    ref: elementRef,
    clickable: true,
    mouse: true,
    autoFocus: false,
    left: props.left,
    top: props.top,
    width: props.width,
    height: props.height,
    style: props.style,
    tags: true,
    wrap: false,
    content: itemsContent,
    onWheelup: () => {
      props.setViewport(viewport.up());
    },
    onWheeldown: () => {
      props.setViewport(viewport.down());
    },
    onClick: (/** @type {MouseEvent}*/ data) => {
      const curr = elementRef.current;
      const y = data.y - /** @type {number} */ (curr.atop);
      const index = offset + y;
      if (index < length) {
        props.onClick(index);
      }
    },
  });
};

ListView.displayName = "ListView";

export default ListView;
