/**
 * @typedef {import("../../src/menu/SubMenu.mjs").SubMenuProps} SubMenuProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import withThemeContext from "../theme/withThemeContext.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import SingleChars from "../../src/border/SingleChars.mjs";
import DoubleChars from "../../src/border/DoubleChars.mjs";
import DoubleBorder from "../../src/border/DoubleBorder.mjs";
import HorizontalLine from "../../src/border/HorizontalLine.mjs";
import SubMenu from "../../src/menu/SubMenu.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

SubMenu.doubleBorderComp = mockComponent(DoubleBorder);
SubMenu.horizontalLineComp = mockComponent(HorizontalLine);
const { doubleBorderComp, horizontalLineComp } = SubMenu;

describe("SubMenu.test.mjs", () => {
  it("should call onClick with item index when onClick", () => {
    //given
    const onClick = mockFunction((index) => {
      assert.deepEqual(index, 2);
    });
    const props = /** @type {SubMenuProps} */ ({
      selected: 0,
      items: ["item 1", SubMenu.separator, "item 2"],
      top: 1,
      left: 2,
      onClick,
    });
    const comp = TestRenderer.create(withThemeContext(h(SubMenu, props))).root;
    const [_, textEl] = comp.findAllByType("text");

    //when
    textEl.props.onClick(null);

    //then
    assert.deepEqual(onClick.times, 1);
  });

  it("should render component", () => {
    //given
    const props = /** @type {SubMenuProps} */ ({
      selected: 0,
      items: ["item 1", SubMenu.separator, "item 2"],
      top: 1,
      left: 2,
      onClick: mockFunction(),
    });

    //when
    const result = TestRenderer.create(
      withThemeContext(h(SubMenu, props))
    ).root;

    //then
    assertSubMenu(result, props);
  });
});

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {SubMenuProps} props
 */
function assertSubMenu(result, props) {
  assert.deepEqual(SubMenu.displayName, "SubMenu");

  const textWidth = props.items.reduce((_1, _2) => Math.max(_1, _2.length), 0);
  const width = 2 + textWidth;
  const height = 2 + props.items.length;
  const theme = DefaultTheme.popup.menu;

  assertComponents(
    result.children,
    h(
      "box",
      {
        clickable: true,
        autoFocus: false,
        width: width,
        height: height,
        top: props.top,
        left: props.left,
        shadow: true,
        style: theme,
      },
      ...[
        h(doubleBorderComp, {
          width,
          height,
          style: theme,
        }),

        ...props.items.map((text, index) => {
          if (text === SubMenu.separator) {
            return h(horizontalLineComp, {
              left: 0,
              top: 1 + index,
              length: width,
              lineCh: SingleChars.horizontal,
              style: theme,
              startCh: DoubleChars.leftSingle,
              endCh: DoubleChars.rightSingle,
            });
          }

          const style = props.selected === index ? theme.focus : theme;
          return h("text", {
            height: 1,
            left: 1,
            top: 1 + index,
            clickable: true,
            mouse: true,
            autoFocus: false,
            style,
            content: text,
          });
        }),
      ]
    )
  );
}
