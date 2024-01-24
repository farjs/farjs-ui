/**
 * @typedef {"left" | "right" | "center"} TextAlignType
 */

/** @type {TextAlignType} */
const left = "left";

/** @type {TextAlignType} */
const right = "right";

/** @type {TextAlignType} */
const center = "center";

const TextAlign = Object.freeze({
  left,
  right,
  center,
});

export default TextAlign;
