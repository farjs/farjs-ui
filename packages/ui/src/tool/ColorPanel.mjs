import React from "react";

const h = React.createElement;

/**
 * @param {number} n
 * @returns {string}
 */
const toHex = (n) => n.toString(16);

const ColorPanel = () => {
  const levels = [0x0, 0x5, 0x8, 0xa, 0xc, 0xe];
  const mainColors = levels
    .map((group) => {
      return levels
        .map((row) => {
          return levels
            .map((level) => {
              const fg =
                group > 0xa
                  ? "black"
                  : row > 0xa
                  ? "black"
                  : level > 0xa
                  ? "black"
                  : "white";

              const color = `#${toHex(group)}${toHex(row)}${toHex(level)}`;
              return `{${fg}-fg}{${color}-bg}${color}{/}`;
            })
            .join("");
        })
        .join("\n");
    })
    .join("\n");

  const grayScale = [0x0, 0x3, 0x5, 0x8, 0xa, 0xc, 0xf]
    .map((level) => {
      const fg = level > 0xa ? "black" : "white";

      const color = `#${toHex(level)}${toHex(level)}${toHex(level)}`;
      return `{${fg}-fg}{${color}-bg}${color}{/}`;
    })
    .join("");

  return h("log", {
    autoFocus: false,
    mouse: true,
    tags: true,
    scrollbar: true,
    scrollable: true,
    alwaysScroll: true,
    content: `${mainColors}\n\n${grayScale}`,
  });
};

ColorPanel.displayName = "ColorPanel";

export default ColorPanel;
