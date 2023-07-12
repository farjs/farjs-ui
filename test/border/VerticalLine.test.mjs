/**
 * @typedef {import('../../src/border/VerticalLine').VerticalLineProps} VerticalLineProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents } from "react-assert";
import VerticalLine from "../../src/border/VerticalLine.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

describe("VerticalLine.test.mjs", () => {
  it("should render line without start and end chars", () => {
    //given
    const props = {
      ...getVerticalLineProps(),
      startCh: undefined,
      endCh: undefined,
    };

    //when
    const result = TestRenderer.create(h(VerticalLine, props)).root;

    //then
    assertVerticalLine(result, props, "*****");
  });

  it("should render line with start char", () => {
    //given
    const props = {
      ...getVerticalLineProps(),
      startCh: "+",
      endCh: undefined,
    };

    //when
    const result = TestRenderer.create(h(VerticalLine, props)).root;

    //then
    assertVerticalLine(result, props, "+****");
  });

  it("should render line with end char", () => {
    //given
    const props = {
      ...getVerticalLineProps(),
      startCh: undefined,
      endCh: "-",
    };

    //when
    const result = TestRenderer.create(h(VerticalLine, props)).root;

    //then
    assertVerticalLine(result, props, "****-");
  });

  it("should render line with start and end chars", () => {
    //given
    const props = {
      ...getVerticalLineProps(),
      startCh: "+",
      endCh: "-",
    };

    //when
    const result = TestRenderer.create(h(VerticalLine, props)).root;

    //then
    assertVerticalLine(result, props, "+***-");
  });
});

/**
 * @returns {VerticalLineProps}
 */
function getVerticalLineProps() {
  return {
    left: 1,
    top: 2,
    length: 5,
    lineCh: "*",
    style: {
      fg: "white",
      bg: "blue",
    },
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {VerticalLineProps} props
 * @param {string} content
 */
function assertVerticalLine(result, props, content) {
  assert.deepEqual(VerticalLine.displayName, "VerticalLine");

  assertComponents(
    result.children,
    h("text", {
      width: 1,
      height: props.length,
      left: props.left,
      top: props.top,
      style: props.style,
      content,
    })
  );
}
