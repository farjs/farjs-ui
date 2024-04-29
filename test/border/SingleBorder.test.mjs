/**
 * @typedef {import("../../src/border/SingleBorder.mjs").SingleBorderProps} SingleBorderProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import HorizontalLine from "../../src/border/HorizontalLine.mjs";
import VerticalLine from "../../src/border/VerticalLine.mjs";
import SingleChars from "../../src/border/SingleChars.mjs";
import SingleBorder from "../../src/border/SingleBorder.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

SingleBorder.horizontalLineComp = mockComponent(HorizontalLine);
SingleBorder.verticalLineComp = mockComponent(VerticalLine);

const { horizontalLineComp, verticalLineComp } = SingleBorder;

describe("SingleBorder.test.mjs", () => {
  it("should render component", () => {
    //given
    const props = getSingleBorderProps();

    //when
    const result = TestRenderer.create(h(SingleBorder, props)).root;

    //then
    assertSingleBorder(result, props);
  });
});

/**
 * @returns {SingleBorderProps}
 */
function getSingleBorderProps() {
  return {
    width: 3,
    height: 4,
    style: {
      fg: "black",
      bg: "cyan",
    },
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {SingleBorderProps} props
 */
function assertSingleBorder(result, props) {
  assert.deepEqual(SingleBorder.displayName, "SingleBorder");

  assertComponents(
    result.children,
    h(horizontalLineComp, {
      left: 0,
      top: 0,
      length: 3,
      lineCh: SingleChars.horizontal,
      style: props.style,
      startCh: SingleChars.topLeft,
      endCh: SingleChars.topRight,
    }),
    h(verticalLineComp, {
      left: 0,
      top: 1,
      length: 2,
      lineCh: SingleChars.vertical,
      style: props.style,
    }),
    h(verticalLineComp, {
      left: 2,
      top: 1,
      length: 2,
      lineCh: SingleChars.vertical,
      style: props.style,
    }),
    h(horizontalLineComp, {
      left: 0,
      top: 3,
      length: 3,
      lineCh: SingleChars.horizontal,
      style: props.style,
      startCh: SingleChars.bottomLeft,
      endCh: SingleChars.bottomRight,
    })
  );
}
