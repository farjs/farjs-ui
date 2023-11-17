/**
 * @typedef {import('../src/Button').ButtonProps} ButtonProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import * as UI from "../src/UI.mjs";
import Button from "../src/Button.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("Button.test.mjs", () => {
  it("should call onPress when press button", () => {
    //given
    const onPressMock = mockFunction();
    const props = getButtonProps(onPressMock);
    const result = TestRenderer.create(h(Button, props)).root;
    const button = result.findByType("button");

    //when
    button.props.onPress();

    //then
    assert.deepEqual(onPressMock.times, 1);
  });

  it("should change focused state when onFocus/onBlur", () => {
    //given
    const props = getButtonProps();
    const renderer = TestRenderer.create(h(Button, props));
    const button = renderer.root.findByType("button");
    assertButton(renderer.root, props, false);

    //when & then
    button.props.onFocus();
    assertButton(renderer.root, props, true);

    //when & then
    button.props.onBlur();
    assertButton(renderer.root, props, false);
  });

  it("should render component", () => {
    //given
    const props = getButtonProps();

    //when
    const result = TestRenderer.create(h(Button, props)).root;

    //then
    assert.deepEqual(Button.displayName, "Button");
    assertButton(result, props, false);
  });
});

/**
 * @param {() => void} onPress
 * @returns {ButtonProps}
 */
function getButtonProps(onPress = () => {}) {
  return {
    left: 1,
    top: 2,
    label: "test button",
    style: {
      fg: "white",
      bg: "blue",
      focus: {
        fg: "cyan",
        bg: "black",
      },
    },
    onPress,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ButtonProps} props
 * @param {boolean} focused
 */
function assertButton(result, props, focused) {
  const style = focused ? props.style.focus : props.style;

  assertComponents(
    result.children,
    h("button", {
      mouse: true,
      tags: true,
      wrap: false,
      width: props.label.length,
      height: 1,
      left: props.left,
      top: props.top,
      content: UI.renderText2(style, props.label),
    })
  );
}
