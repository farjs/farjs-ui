import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import LogPanel from "../../src/tool/LogPanel.mjs";
import InputController from "../../src/tool/InputController.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

InputController.logPanelComp = mockComponent(LogPanel);
InputController.maxBufferLength = 10;
const { logPanelComp } = InputController;
const g = global;

/**
 * @param {string} msg
 */
const logKeys = (msg) => {
  if (g.farjsLogKeys) {
    g.farjsLogKeys(msg);
  }
};

describe("InputController.test.mjs", () => {
  it("should render component and collect keys input", () => {
    //given
    assert.deepEqual(g.farjsLogKeys, undefined);

    //when & then
    const renderer = TestRenderer.create(h(InputController));
    assert.deepEqual(typeof g.farjsLogKeys, "function");

    //when & then
    logKeys("key 1");
    assertInputController(renderer, "key 1\n");

    //when & then
    logKeys("k 2");
    assertInputController(renderer, "key 1\nk 2\n");

    //when & then
    logKeys("k 3");
    assertInputController(renderer, "k 2\nk 3\n");

    //when & then
    TestRenderer.act(() => {
      renderer.unmount();
    });
    assert.deepEqual(g.farjsLogKeys, undefined);

    //then
    assert.deepEqual(InputController.displayName, "InputController");
  });
});

/**
 * @param {TestRenderer.ReactTestRenderer} renderer
 * @param {string} content
 */
function assertInputController(renderer, content) {
  assertComponents(
    renderer.root.children,
    h(logPanelComp, {
      content,
    })
  );
}
