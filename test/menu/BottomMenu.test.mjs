/**
 * @typedef {import("../../src/menu/BottomMenu").BottomMenuProps} BottomMenuProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponent, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import WithSize from "../../src/WithSize.mjs";
import BottomMenuView from "../../src/menu/BottomMenuView.mjs";
import BottomMenu from "../../src/menu/BottomMenu.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

BottomMenu.withSizeComp = mockComponent(WithSize);
BottomMenu.bottomMenuViewComp = mockComponent(BottomMenuView);
const { withSizeComp, bottomMenuViewComp } = BottomMenu;

describe("BottomMenu.test.mjs", () => {
  it("should render component", () => {
    //given
    const props = /** @type {BottomMenuProps} */ ({
      items: new Array(12).fill("item"),
    });

    //when
    const result = TestRenderer.create(h(BottomMenu, props)).root;

    //then
    assertBottomMenu(result, props);
  });
});

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {BottomMenuProps} props
 */
function assertBottomMenu(result, props) {
  assert.deepEqual(BottomMenu.displayName, "BottomMenu");

  const [width, height] = [80, 25];
  const withSize = result.findByType(withSizeComp);
  const comp = TestRenderer.create(withSize.props.render(width, height)).root;

  assertComponent(
    comp,
    h(bottomMenuViewComp, {
      width,
      items: props.items,
    })
  );
}
