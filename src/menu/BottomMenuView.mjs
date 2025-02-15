import React from "react";
import Theme from "../theme/Theme.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly width: number;
 *  readonly items: readonly string[];
 * }} BottomMenuViewProps
 */

/**
 * @typedef {{
 *  readonly key: number;
 *  readonly item: string;
 *  readonly pos: number;
 *  readonly textWidth: number;
 * }} BottomMenuViewItem
 */

/**
 * @param {BottomMenuViewProps} props
 */
const BottomMenuView = (props) => {
  const theme = Theme.useTheme().menu;
  const width = props.width;
  const items = props.items;

  const itemsCount = items.length;
  const itemWidth = Math.trunc(width / itemsCount);
  /** @type {readonly BottomMenuViewItem[]} */
  const itemsWithPos = items.map((item, index) => {
    const leftPos = index * itemWidth;

    function text() {
      const textWidth = Math.max(itemWidth - 2, 0); // excluding key width
      const len = item.length;
      if (len < textWidth) {
        const pad = Math.trunc((textWidth - len) / 2);
        const paddingL = " ".repeat(pad);
        const paddingR = " ".repeat(
          pad + len + pad < textWidth ? textWidth - pad - len : pad
        );

        return `${paddingL}${item}${paddingR}`;
      }

      return item.slice(0, Math.min(textWidth, item.length));
    }

    return { key: index + 1, item: text(), pos: leftPos, textWidth: itemWidth };
  });

  const keyBold = theme.key.bold ? "{bold}" : "";
  const keyFg = theme.key.fg;
  const keyBg = theme.key.bg;

  const itemBold = theme.item.bold ? "{bold}" : "";
  const itemFg = theme.item.fg;
  const itemBg = theme.item.bg;

  /** @type {(num: number, places: number) => string} */
  const spacePad = (num, places) => String(num).padStart(places, " ");

  return h(
    React.Fragment,
    null,
    ...itemsWithPos.map(({ key, item, pos, textWidth }) => {
      return h("text", {
        key: `${key}`,
        width: textWidth,
        autoFocus: false,
        clickable: true,
        tags: true,
        mouse: true,
        left: pos,
        onClick: () => {
          process.stdin.emit("keypress", undefined, {
            name: `f${key}`,
            ctrl: false,
            meta: false,
            shift: false,
          });
        },
        content: `{${keyFg}-fg}{${keyBg}-bg}${keyBold}${spacePad(
          key,
          2
        )}{/}{${itemFg}-fg}{${itemBg}-bg}${itemBold}${item}{/}`,
      });
    })
  );
};

BottomMenuView.displayName = "BottomMenuView";

export default BottomMenuView;
