/**
 * @typedef {import('../src/CheckBox').CheckBoxProps} CheckBoxProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import Button from "../src/Button.mjs";
import CheckBox from "../src/CheckBox.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

CheckBox.buttonComp = mockComponent(Button);
const { buttonComp } = CheckBox;

describe("CheckBox.test.mjs", () => {
  it("should call onChange when press button", () => {
    //given
    const onChange = mockFunction();
    const props = { ...getCheckBoxProps(), onChange };
    const comp = TestRenderer.create(h(CheckBox, props)).root;
    const button = comp.findByType(buttonComp);

    //when
    button.props.onPress();

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should render checked component", () => {
    //given
    const props = { ...getCheckBoxProps(), value: true };

    //when
    const result = TestRenderer.create(h(CheckBox, props)).root;

    //then
    assertCheckBox(result, props);
  });

  it("should render un-checked component", () => {
    //given
    const props = getCheckBoxProps();
    assert.deepEqual(props.value, false);

    //when
    const result = TestRenderer.create(h(CheckBox, props)).root;

    //then
    assertCheckBox(result, props);
  });
});

/**
 * @returns {CheckBoxProps}
 */
function getCheckBoxProps() {
  return {
    left: 1,
    top: 2,
    value: false,
    label: "test item",
    style: {
      fg: "white",
      bg: "blue",
      focus: {
        fg: "cyan",
        bg: "black",
      },
    },
    onChange: () => {},
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {CheckBoxProps} props
 */
function assertCheckBox(result, props) {
  assert.deepEqual(CheckBox.displayName, "CheckBox");

  assertComponents(
    result.children,
    h(buttonComp, {
      left: props.left,
      top: props.top,
      label: props.value ? "[x]" : "[ ]",
      style: props.style,
      onPress: () => {},
    }),
    h("text", {
      height: 1,
      left: props.left + 4,
      top: props.top,
      style: props.style,
      content: props.label,
    })
  );
}
