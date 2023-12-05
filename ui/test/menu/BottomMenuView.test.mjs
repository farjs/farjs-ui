/**
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg} IKeyEventArg
 * @typedef {import("../../src/menu/BottomMenuView").BottomMenuViewProps} BottomMenuViewProps
 * @typedef {import("../../src/menu/BottomMenuView.mjs").BottomMenuViewItem} BottomMenuViewItem
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import withThemeContext from "../theme/withThemeContext.mjs";
import BottomMenuView from "../../src/menu/BottomMenuView.mjs";
import XTerm256Theme from "../../src/theme/XTerm256Theme.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("BottomMenuView.test.mjs", () => {
  it("should emit keypress event when onClick", () => {
    //given
    // @ts-ignore
    const onKey = mockFunction((name, ctrl, meta, shift) => {
      //then
      assert.deepEqual(name, `f${onKey.times}`);
      assert.deepEqual(ctrl, false);
      assert.deepEqual(meta, false);
      assert.deepEqual(shift, false);
    });
    /** @type {(ch: object, key: IKeyEventArg) => void} */
    const listener = (_, key) => {
      onKey(key.name, key.ctrl, key.meta, key.shift);
    };
    process.stdin.on("keypress", listener);

    const props = /** @type {BottomMenuViewProps} */ ({
      width: 80,
      items: new Array(12).fill("item"),
    });
    const clickables = /** @type {TestRenderer.ReactTestInstance[]} */ (
      TestRenderer.create(withThemeContext(h(BottomMenuView, props))).root
        .children
    );

    //when
    clickables[0].props.onClick();
    clickables[1].props.onClick();
    clickables[2].props.onClick();
    clickables[3].props.onClick();
    clickables[4].props.onClick();
    clickables[5].props.onClick();
    clickables[6].props.onClick();
    clickables[7].props.onClick();
    clickables[8].props.onClick();
    clickables[9].props.onClick();
    clickables[10].props.onClick();
    clickables[11].props.onClick();

    //cleanup
    process.stdin.removeListener("keypress", listener);

    //then
    assert.deepEqual(onKey.times, 12);
  });

  it("should render component", () => {
    //given
    const currTheme = XTerm256Theme;
    const theme = currTheme.menu;
    const items = new Array(12).fill("item");
    items[5] = "longitem";
    const props = /** @type {BottomMenuViewProps} */ ({
      width: 98,
      items,
    });

    //when
    const result = TestRenderer.create(
      withThemeContext(h(BottomMenuView, props), currTheme)
    ).root;

    //then
    assert.deepEqual(BottomMenuView.displayName, "BottomMenuView");

    /** @type {BottomMenuViewItem[]} */
    const itemsWithPos = [
      { key: 1, item: " item ", pos: 0, textWidth: 8 },
      { key: 2, item: " item ", pos: 8, textWidth: 8 },
      { key: 3, item: " item ", pos: 16, textWidth: 8 },
      { key: 4, item: " item ", pos: 24, textWidth: 8 },
      { key: 5, item: " item ", pos: 32, textWidth: 8 },
      { key: 6, item: "longit", pos: 40, textWidth: 8 },
      { key: 7, item: " item ", pos: 48, textWidth: 8 },
      { key: 8, item: " item ", pos: 56, textWidth: 8 },
      { key: 9, item: " item ", pos: 64, textWidth: 8 },
      { key: 10, item: " item ", pos: 72, textWidth: 8 },
      { key: 11, item: " item ", pos: 80, textWidth: 8 },
      { key: 12, item: " item ", pos: 88, textWidth: 8 },
    ];
    const keyFg = theme.key.fg;
    const keyBg = theme.key.bg;
    const itemFg = theme.item.fg;
    const itemBg = theme.item.bg;

    assertComponents(
      result.children,
      ...itemsWithPos.map(({ key, item, pos, textWidth }) => {
        const keyPadded = key < 10 ? ` ${key}` : `${key}`;

        return h("text", {
          key: `${key}`,
          width: textWidth,
          autoFocus: false,
          clickable: true,
          tags: true,
          mouse: true,
          left: pos,
          content: `{${keyFg}-fg}{${keyBg}-bg}{bold}${keyPadded}{/}{${itemFg}-fg}{${itemBg}-bg}{bold}${item}{/}`,
        });
      })
    );
  });
});
