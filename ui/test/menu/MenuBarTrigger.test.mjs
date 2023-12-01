/**
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg} IKeyEventArg
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import PopupOverlay from "../../src/popup/PopupOverlay.mjs";
import MenuBarTrigger from "../../src/menu/MenuBarTrigger.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("MenuBarTrigger.test.mjs", () => {
  it("should emit keypress event when onClick", () => {
    //given
    const onKey = mockFunction((name, ctrl, meta, shift) => {
      //then
      assert.deepEqual(name, "f9");
      assert.deepEqual(ctrl, false);
      assert.deepEqual(meta, false);
      assert.deepEqual(shift, false);
    });
    /** @type {(ch: object, key: IKeyEventArg) => void} */
    const listener = (_, key) => {
      //cleanup
      process.stdin.removeListener("keypress", listener);

      //then
      onKey(key.name, key.ctrl, key.meta, key.shift);
    };
    process.stdin.on("keypress", listener);

    const renderer = TestRenderer.create(h(MenuBarTrigger));
    const clickable = renderer.root.findByType("box");

    //when
    clickable.props.onClick();

    //then
    assert.deepEqual(onKey.times, 1);
  });

  it("should render component", () => {
    //when
    const result = TestRenderer.create(h(MenuBarTrigger)).root;

    //then
    assertMenuBarTrigger(result);
  });
});

/**
 * @param {TestRenderer.ReactTestInstance} result
 */
function assertMenuBarTrigger(result) {
  assert.deepEqual(MenuBarTrigger.displayName, "MenuBarTrigger");

  assertComponents(
    result.children,
    h("box", {
      height: 1,
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: PopupOverlay.style,
    })
  );
}
