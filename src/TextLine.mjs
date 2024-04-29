import React from "react";
import UiString from "./UiString.mjs";
import TextAlign from "./TextAlign.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly align: import("./TextAlign.mjs").TextAlign;
 *  readonly left: number;
 *  readonly top: number;
 *  readonly width: number;
 *  readonly text: string;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly focused?: boolean;
 *  readonly padding?: number;
 * }} TextLineProps
 */

/**
 * @param {TextLineProps} props
 */
const TextLine = (props) => {
  const paddingLen = props.padding ?? 1;
  const padding = " ".repeat(paddingLen);
  const wrapped = TextLine.wrapText(props.text, props.width - paddingLen * 2);
  const text = UiString(`${padding}${wrapped}${padding}`);

  if (text.strWidth() > 0) {
    function getLeft() {
      switch (props.align) {
        case TextAlign.left:
          return props.left;
        case TextAlign.right:
          return props.left + props.width - text.strWidth();
        default:
          return props.left + Math.trunc((props.width - text.strWidth()) / 2);
      }
    }

    return h("text", {
      width: text.strWidth(),
      height: 1,
      left: getLeft(),
      top: props.top,
      style: props.focused ?? false ? props.style.focus : props.style,
      content: text.toString(),
    });
  }

  return null;
};

TextLine.displayName = "TextLine";

/**
 * @param {string} text
 * @param {number} width
 * @param {number} prefixLen
 * @returns {string}
 */
TextLine.wrapText = (text, width, prefixLen = 3) => {
  const t = UiString(text);
  const dx = t.strWidth() - width;
  if (dx > 0) {
    const prefix = t.slice(0, Math.min(prefixLen, t.strWidth()));
    const sufix = t.slice(
      Math.min(dx + prefixLen + 3, t.strWidth()),
      t.strWidth()
    ); // prefix + ...
    return `${prefix}...${sufix}`;
  }

  return text;
};

export default TextLine;
