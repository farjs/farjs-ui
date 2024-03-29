/**
 * @typedef {import("../src/TextInput").TextInputProps} TextInputProps
 * @typedef {import('../src/TextBox').TextBoxProps} TextBoxProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import TextInput from "../src/TextInput.mjs";
import TextBox from "../src/TextBox.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

TextBox.textInputComp = mockComponent(TextInput);
const { textInputComp } = TextBox;

describe("TextBox.test.mjs", () => {
  it("should update state when stateUpdater", () => {
    //given
    const props = getTextBoxProps();
    const renderer = TestRenderer.create(h(TextBox, props));
    const textInput = /** @type {TextInputProps} */ (
      renderer.root.findByType(textInputComp).props
    );
    assert.notDeepEqual(textInput.state, {
      offset: 1,
      cursorX: 2,
      selStart: 3,
      selEnd: 4,
    });

    //when
    textInput.stateUpdater((s) => {
      return { ...s, offset: 1, cursorX: 2, selStart: 3, selEnd: 4 };
    });

    //then
    const updatedTextInput = renderer.root.findByType(textInputComp).props;
    assert.deepEqual(updatedTextInput.state, {
      offset: 1,
      cursorX: 2,
      selStart: 3,
      selEnd: 4,
    });
  });

  it("should render component", () => {
    //given
    const props = getTextBoxProps();

    //when
    const result = TestRenderer.create(h(TextBox, props)).root;

    //then
    assertTextBox(result, props);
  });
});

/**
 * @returns {TextBoxProps}
 */
function getTextBoxProps() {
  return {
    left: 1,
    top: 2,
    width: 10,
    value: "initial name",
    onChange: () => {},
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {TextBoxProps} props
 */
function assertTextBox(result, props) {
  assert.deepEqual(TextBox.displayName, "TextBox");

  const textInputProps = result.findByType(textInputComp).props;

  assertComponents(
    result.children,
    h(textInputComp, {
      inputRef: textInputProps.inputRef,
      left: props.left,
      top: props.top,
      width: props.width,
      value: props.value,
      state: TextInput.createState(),
      stateUpdater: () => {},
      onChange: props.onChange,
      onEnter: props.onEnter,
    })
  );
}
