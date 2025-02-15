import Blessed from "@farjs/blessed";

/**
 * @param {import("@farjs/blessed").Widgets.Types.TStyle | undefined} style
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

/**
 * @param {string} text
 * @param {number} maxLen
 * @returns {readonly string[]}
 */
export function splitText(text, maxLen) {
  const sentences = text.split("\n");

  return sentences.flatMap((sentence) => {
    const words = sentence.trim().split(" ");
    const res = /** @type {string[]} */ ([]);

    words.forEach((item) => {
      if (res.length === 0) {
        res.push(item);
        return;
      }

      const hIndex = res.length - 1;
      const head = res[hIndex];
      if (head.length + item.length >= maxLen) {
        res.push(item);
      } else {
        res[hIndex] = `${head} ${item}`;
      }
    });

    return res;
  });
}
