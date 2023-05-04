import Blessed from "@farjs/blessed";

/**
 * @typedef { import('blessed').Widgets.Types.TStyle } BlessedStyle
 */

/**
 * @param {BlessedStyle | undefined} style
 * @param {string} text
 * @returns {string}
 */
export function renderText2(style, text) {
  return renderText(
    style?.bold || false,
    style?.fg || "white",
    style?.bg || "black",
    text
  );
}

/**
 * @param {boolean} isBold
 * @param {string} fgColor
 * @param {string} bgColor
 * @param {string} text
 * @returns {string}
 */
export function renderText(isBold, fgColor, bgColor, text) {
  if (text.length === 0) {
    return text;
  }

  const bold = isBold ? "{bold}" : "";
  return `${bold}{${fgColor}-fg}{${bgColor}-bg}${Blessed.escape(text)}{/}`;
}
