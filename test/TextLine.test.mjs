/**
 * @typedef {import('../src/TextLine').TextLineProps} TextLineProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents } from "react-assert";
import UiString from "../src/UiString.mjs";
import TextAlign from "../src/TextAlign.mjs";
import TextLine from "../src/TextLine.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("TextLine.test.mjs", () => {
  it("should render Left aligned text", () => {
    //given
    const left = 1;
    const props = {
      ...getTextLineProps(),
      align: TextAlign.left,
      left: left,
      top: 2,
      width: 15,
      text: "test itemй",
    };

    //when
    const result = TestRenderer.create(h(TextLine, props)).root;

    //then
    assert.deepEqual(TextLine.displayName, "TextLine");
    assertTextLine(result, props, left, " test itemй ");
  });

  it("should render Center aligned text", () => {
    //given
    const left = 1;
    const props = {
      ...getTextLineProps(),
      align: TextAlign.center,
      left: left,
      top: 2,
      width: 15,
      text: "test itemй",
    };

    //when
    const result = TestRenderer.create(h(TextLine, props)).root;

    //then
    assertTextLine(result, props, left + 1, " test itemй ");
  });

  it("should render Right aligned text", () => {
    //given
    const left = 1;
    const props = {
      ...getTextLineProps(),
      align: TextAlign.right,
      left: left,
      top: 2,
      width: 15,
      text: "test itemй",
    };

    //when
    let result = TestRenderer.create(h(TextLine, props)).root;
    //then
    //       10|  15|
    //    test itemй
    assertTextLine(result, props, left + 3, " test itemй ");

    //when empty
    result = TestRenderer.create(h(TextLine, { ...props, text: "" })).root;
    //then
    //       10|  15|
    //
    assertTextLine(result, props, left + 13, "  ");

    //when without padding
    result = TestRenderer.create(h(TextLine, { ...props, padding: 0 })).root;
    //then
    //       10|  15|
    //     test itemй
    assertTextLine(result, props, left + 5, "test itemй");

    //when empty text without padding
    result = TestRenderer.create(
      h(TextLine, { ...props, text: "", padding: 0 })
    ).root;
    //then
    assertTextLine(result, props, 0, "");
  });

  it("should render focused text", () => {
    //given
    const left = 1;
    const props = {
      ...getTextLineProps(),
      left: left,
      top: 2,
      width: 12,
      text: "test item",
      focused: true,
    };

    //when
    const result = TestRenderer.create(h(TextLine, props)).root;

    //then
    assertTextLine(result, props, left, " test item ");
  });

  it("should render text without padding", () => {
    //given
    const left = 1;
    const props = {
      ...getTextLineProps(),
      left: left,
      top: 2,
      width: 12,
      text: "test itemй",
      focused: false,
      padding: 0,
    };

    //when
    const result = TestRenderer.create(h(TextLine, props)).root;

    //then
    assertTextLine(result, props, left, "test itemй");
  });

  it("should render long text with ellipsis", () => {
    //given
    const left = 1;
    const props = {
      ...getTextLineProps(),
      left: left,
      top: 2,
      width: 12,
      text: "test long itemй",
    };

    //when
    const result = TestRenderer.create(h(TextLine, props)).root;

    //then
    assertTextLine(result, props, left, " tes...temй ");
  });
});

/**
 * @returns {TextLineProps}
 */
function getTextLineProps() {
  return {
    align: TextAlign.left,
    left: 1,
    top: 2,
    width: 10,
    text: "test item",
    style: {
      fg: "white",
      bg: "blue",
      focus: {},
    },
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {TextLineProps} props
 * @param {number} left
 * @param {string} text
 */
function assertTextLine(result, props, left, text) {
  if (text.length > 0) {
    assertComponents(
      result.children,
      h("text", {
        width: UiString(text).strWidth(),
        height: 1,
        left: left,
        top: props.top,
        style: props.focused ?? false ? props.style.focus : props.style,
        content: text,
      })
    );
  } else {
    assert.deepEqual(result.children, []);
  }
}
