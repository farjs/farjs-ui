/**
 * @typedef {import('../../src/border/DoubleBorder').DoubleBorderProps} DoubleBorderProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import TextAlign from "../../src/TextAlign.mjs";
import TextLine from "../../src/TextLine.mjs";
import HorizontalLine from "../../src/border/HorizontalLine.mjs";
import VerticalLine from "../../src/border/VerticalLine.mjs";
import DoubleChars from "../../src/border/DoubleChars.mjs";
import DoubleBorder from "../../src/border/DoubleBorder.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

DoubleBorder.horizontalLineComp = mockComponent(HorizontalLine);
DoubleBorder.verticalLineComp = mockComponent(VerticalLine);
DoubleBorder.textLineComp = mockComponent(TextLine);

const { horizontalLineComp, verticalLineComp, textLineComp } = DoubleBorder;

describe("DoubleBorder.test.mjs", () => {
  it("should render component", () => {
    //given
    const props = getDoubleBorderProps();

    //when
    const result = TestRenderer.create(h(DoubleBorder, props)).root;

    //then
    assertDoubleBorder(result, props);
  });

  it("should render component with title", () => {
    //given
    const props = {
      ...getDoubleBorderProps(),
      left: 1,
      top: 2,
      title: "test title",
    };

    //when
    const result = TestRenderer.create(h(DoubleBorder, props)).root;

    //then
    assertDoubleBorder(result, props);
  });

  it("should render component with title and footer", () => {
    //given
    const props = {
      ...getDoubleBorderProps(),
      left: 1,
      top: 2,
      title: "test title",
      footer: "test footer",
    };

    //when
    const result = TestRenderer.create(h(DoubleBorder, props)).root;

    //then
    assertDoubleBorder(result, props);
  });
});

/**
 * @returns {DoubleBorderProps}
 */
function getDoubleBorderProps() {
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
 * @param {DoubleBorderProps} props
 */
function assertDoubleBorder(result, props) {
  assert.deepEqual(DoubleBorder.displayName, "DoubleBorder");

  const left = props.left ?? 0;
  const top = props.top ?? 0;
  const expected = /** @type {React.ReactElement[]} */ ([
    h(horizontalLineComp, {
      left: left,
      top: top,
      length: props.width,
      lineCh: DoubleChars.horizontal,
      style: props.style,
      startCh: DoubleChars.topLeft,
      endCh: DoubleChars.topRight,
    }),
    props.title
      ? h(textLineComp, {
          align: TextAlign.center,
          left: left,
          top: top,
          width: props.width,
          text: props.title,
          style: props.style,
        })
      : null,
    h(verticalLineComp, {
      left: left,
      top: top + 1,
      length: props.height - 2,
      lineCh: DoubleChars.vertical,
      style: props.style,
    }),
    h(verticalLineComp, {
      left: left + props.width - 1,
      top: top + 1,
      length: props.height - 2,
      lineCh: DoubleChars.vertical,
      style: props.style,
    }),
    h(horizontalLineComp, {
      left: left,
      top: top + props.height - 1,
      length: props.width,
      lineCh: DoubleChars.horizontal,
      style: props.style,
      startCh: DoubleChars.bottomLeft,
      endCh: DoubleChars.bottomRight,
    }),
    props.footer
      ? h(textLineComp, {
          align: TextAlign.center,
          left: left,
          top: top + props.height - 1,
          width: props.width,
          text: props.footer,
          style: props.style,
        })
      : null,
  ]).filter((h) => h !== null);

  assertComponents(result.children, ...expected);
}
