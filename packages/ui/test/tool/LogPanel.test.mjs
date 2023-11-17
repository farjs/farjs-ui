/**
 * @typedef {import('../../src/tool/LogPanel').LogPanelProps} LogPanelProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import LogPanel from "../../src/tool/LogPanel.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("LogPanel.test.mjs", () => {
  it("should render component", () => {
    //given
    const props = getLogPanelProps("some log content");

    //when
    const result = TestRenderer.create(h(LogPanel, props)).root;

    //then
    assert.deepEqual(LogPanel.displayName, "LogPanel");
    assertLogPanel(result, props);
  });
});

/**
 * @param {string} content
 * @returns {LogPanelProps}
 */
function getLogPanelProps(content) {
  return {
    content,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {LogPanelProps} props
 */
function assertLogPanel(result, props) {
  assertComponents(
    result.children,
    h("log", {
      autoFocus: false,
      mouse: true,
      style: {
        scrollbar: {
          bg: "cyan",
        },
      },
      scrollbar: true,
      scrollable: true,
      alwaysScroll: true,
      content: props.content,
    })
  );
}
