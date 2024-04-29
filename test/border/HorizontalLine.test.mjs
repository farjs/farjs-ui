/**
 * @typedef {import("../../src/border/HorizontalLine.mjs").HorizontalLineProps} HorizontalLineProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents } from "react-assert";
import HorizontalLine from "../../src/border/HorizontalLine.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("HorizontalLine.test.mjs", () => {
  it("should render line without start and end chars", () => {
    //given
    const props = {
      ...getHorizontalLineProps(),
      startCh: undefined,
      endCh: undefined,
    };

    //when
    const result = TestRenderer.create(h(HorizontalLine, props)).root;

    //then
    assertHorizontalLine(result, props, "*****");
  });

  it("should render line with start char", () => {
    //given
    const props = {
      ...getHorizontalLineProps(),
      startCh: "+",
      endCh: undefined,
    };

    //when
    const result = TestRenderer.create(h(HorizontalLine, props)).root;

    //then
    assertHorizontalLine(result, props, "+****");
  });

  it("should render line with end char", () => {
    //given
    const props = {
      ...getHorizontalLineProps(),
      startCh: undefined,
      endCh: "-",
    };

    //when
    const result = TestRenderer.create(h(HorizontalLine, props)).root;

    //then
    assertHorizontalLine(result, props, "****-");
  });

  it("should render line with start and end chars", () => {
    //given
    const props = {
      ...getHorizontalLineProps(),
      startCh: "+",
      endCh: "-",
    };

    //when
    const result = TestRenderer.create(h(HorizontalLine, props)).root;

    //then
    assertHorizontalLine(result, props, "+***-");
  });
});

/**
 * @returns {HorizontalLineProps}
 */
function getHorizontalLineProps() {
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
 * @param {HorizontalLineProps} props
 * @param {string} content
 */
function assertHorizontalLine(result, props, content) {
  assert.deepEqual(HorizontalLine.displayName, "HorizontalLine");

  assertComponents(
    result.children,
    h("text", {
      width: props.length,
      height: 1,
      left: props.left,
      top: props.top,
      style: props.style,
      content,
    })
  );
}
