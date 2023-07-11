/**
 * @typedef {import("./TextLine").TextLineProps} TextLineProps
 */
import React from "react";
import TextAlign from "./TextAlign.mjs";

const h = React.createElement;

/**
 * @param {TextLineProps} props
 */
const TextLine = (props) => {
  const paddingLen = props.padding ?? 1;
  const padding = " ".repeat(paddingLen);
  const wrapped = TextLine.wrapText(props.text, props.width - paddingLen * 2);
  const text = `${padding}${wrapped}${padding}`;

  if (text.length > 0) {
    function getLeft() {
      switch (props.align) {
        case TextAlign.left:
          return props.left;
        case TextAlign.right:
          return props.left + props.width - text.length;
        default:
          return props.left + (props.width - text.length) / 2;
      }
    }

    return h("text", {
      width: text.length,
      height: 1,
      left: getLeft(),
      top: props.top,
      style: props.focused ?? false ? props.style.focus : props.style,
      content: text,
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
  const dx = text.length - width;
  if (dx > 0) {
    const prefix = text.slice(0, Math.min(prefixLen, text.length));
    const sufix = text.slice(Math.min(dx + prefixLen + 3, text.length)); // prefix + ...
    return `${prefix}...${sufix}`;
  }

  return text;
};

export default TextLine;
