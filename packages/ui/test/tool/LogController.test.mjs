/**
 * @typedef {import("../../src/tool/LogController").LogControllerProps} LogControllerProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import LogController from "../../src/tool/LogController.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

LogController.maxBufferLength = 10;

describe("LogController.test.mjs", () => {
  it("should render component and redirect log output", () => {
    //given
    const oldLog = console.log;
    const oldError = console.error;
    const onReady = mockFunction();
    const render = mockFunction((content) => {
      //then
      if (render.times === 1) {
        assert.deepEqual(content, "");
        return h(React.Fragment, null, "some nested comp");
      }
      if (render.times === 2) {
        assert.deepEqual(content, "log 1\ne 2\n");
        return h(React.Fragment, null, "some nested comp2");
      }

      assert.deepEqual(content, "e 2\ne 3\n");
      return h(React.Fragment, null, "some nested comp3");
    });
    /**
     * @type {LogControllerProps}
     */
    const props = {
      onReady,
      render,
    };

    //when & then
    const renderer = TestRenderer.create(h(LogController, props));
    assert.deepEqual(onReady.times, 1);
    assert.notDeepEqual(console.log, oldLog);
    assert.notDeepEqual(console.error, oldError);
    assertLogController(renderer, "some nested comp");

    //when & then
    TestRenderer.act(() => {
      console.log("log 1");
      console.error("e 2");
    });
    assertLogController(renderer, "some nested comp2");

    //when & then
    TestRenderer.act(() => {
      console.error("e 3");
    });
    assertLogController(renderer, "some nested comp3");

    //when & then
    TestRenderer.act(() => {
      renderer.unmount();
    });
    assert.deepEqual(console.log, oldLog);
    assert.deepEqual(console.error, oldError);

    //then
    assert.deepEqual(LogController.displayName, "LogController");
    assert.deepEqual(onReady.times, 1);
    assert.deepEqual(render.times, 3);
  });
});

/**
 * @param {TestRenderer.ReactTestRenderer} renderer
 * @param {string} rendered
 */
function assertLogController(renderer, rendered) {
  assertComponents(renderer.root.children, rendered);
}
