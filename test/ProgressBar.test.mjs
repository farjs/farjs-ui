/**
 * @typedef {import('../src/ProgressBar').ProgressBarProps} ProgressBarProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import ProgressBar from "../src/ProgressBar.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("ProgressBar.test.mjs", () => {
  it("should render component", () => {
    //given
    const props = getProgressBarProps();

    //when & then
    renderAndAssertProgressBar(props, "█░░░░░░░░");
    renderAndAssertProgressBar({ ...props, percent: 99, length: 1 }, "░");
    renderAndAssertProgressBar({ ...props, percent: 100, length: 1 }, "█");
    renderAndAssertProgressBar(
      { ...props, percent: 0, length: 10 },
      "░░░░░░░░░░"
    );
    renderAndAssertProgressBar(
      { ...props, percent: 9, length: 10 },
      "░░░░░░░░░░"
    );
    renderAndAssertProgressBar(
      { ...props, percent: 10, length: 10 },
      "█░░░░░░░░░"
    );
    renderAndAssertProgressBar(
      { ...props, percent: 20, length: 10 },
      "██░░░░░░░░"
    );
    renderAndAssertProgressBar(
      { ...props, percent: 99, length: 10 },
      "█████████░"
    );
    renderAndAssertProgressBar(
      { ...props, percent: 100, length: 10 },
      "██████████"
    );
    renderAndAssertProgressBar(
      { ...props, percent: 110, length: 10 },
      "██████████"
    );
  });
});

/**
 * @returns {ProgressBarProps}
 */
function getProgressBarProps() {
  return {
    percent: 15,
    left: 1,
    top: 2,
    length: 9,
    style: {
      fg: "white",
      bg: "blue",
    },
  };
}

/**
 * @param {ProgressBarProps} props
 * @param {string} expectedContent
 */
function renderAndAssertProgressBar(props, expectedContent) {
  assert.deepEqual(ProgressBar.displayName, "ProgressBar");

  const result = TestRenderer.create(h(ProgressBar, props)).root;

  assertComponents(
    result.children,
    h("text", {
      height: 1,
      left: props.left,
      top: props.top,
      style: props.style,
      content: expectedContent,
    })
  );
}
