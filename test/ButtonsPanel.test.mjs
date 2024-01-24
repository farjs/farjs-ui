/**
 * @typedef {import("../src/ButtonsPanel").ButtonsPanelAction} ButtonsPanelAction
 * @typedef {import("../src/ButtonsPanel").ButtonsPanelProps} ButtonsPanelProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import Button from "../src/Button.mjs";
import ButtonsPanel from "../src/ButtonsPanel.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

ButtonsPanel.buttonComp = mockComponent(Button);
const { buttonComp } = ButtonsPanel;

describe("ButtonsPanel.test.mjs", () => {
  it("should call onAction1 when press button1", async () => {
    //given
    const onAction1 = mockFunction();
    const onAction2 = mockFunction();
    const props = getButtonsPanelProps([
      getAction("button1", onAction1),
      getAction("button2", onAction2),
    ]);
    const comp = TestRenderer.create(h(ButtonsPanel, props)).root;
    const [b1] = comp.findAllByType(buttonComp);

    //when
    b1.props.onPress();

    //then
    await Promise.resolve().then(() => {
      assert.deepEqual(onAction1.times, 1);
      assert.deepEqual(onAction2.times, 0);
    });
  });

  it("should call onAction2 when press button2", async () => {
    //given
    const onAction1 = mockFunction();
    const onAction2 = mockFunction();
    const props = getButtonsPanelProps([
      getAction("button1", onAction1),
      getAction("button2", onAction2),
    ]);
    const comp = TestRenderer.create(h(ButtonsPanel, props)).root;
    const [_, b2] = comp.findAllByType(buttonComp);

    //when
    b2.props.onPress();

    //then
    await Promise.resolve().then(() => {
      assert.deepEqual(onAction1.times, 0);
      assert.deepEqual(onAction2.times, 1);
    });
  });

  it("should render component with default props", () => {
    //given
    const onAction = mockFunction();
    const props = getButtonsPanelProps([
      getAction("test btn", onAction),
      getAction("test btn2", onAction),
    ]);

    //when
    const result = TestRenderer.create(h(ButtonsPanel, props)).root;

    //then
    assert.deepEqual(ButtonsPanel.displayName, "ButtonsPanel");
    assertButtonsPanel(result, props, [
      { action: "test btn", pos: 0 },
      { action: "test btn2", pos: 8 },
    ]);
  });

  it("should render component with all props", () => {
    //given
    const onAction = mockFunction();
    const props = getButtonsPanelProps(
      [getAction("test btn", onAction), getAction("test btn2", onAction)],
      2,
      3
    );

    //when
    const result = TestRenderer.create(h(ButtonsPanel, props)).root;

    //then
    assert.deepEqual(ButtonsPanel.displayName, "ButtonsPanel");
    assertButtonsPanel(result, props, [
      { action: "  test btn  ", pos: 0 },
      { action: "  test btn2  ", pos: 15 },
    ]);
  });
});

/**
 * @param {string} label
 * @param {() => void} onAction
 * @returns {ButtonsPanelAction}
 */
function getAction(label, onAction) {
  return {
    label,
    onAction,
  };
}

/**
 * @param {ButtonsPanelAction[]} actions
 * @param {number} [padding]
 * @param {number} [margin]
 * @returns {ButtonsPanelProps}
 */
function getButtonsPanelProps(actions, padding, margin) {
  return {
    top: 1,
    actions,
    style: {
      fg: "white",
      bg: "blue",
      focus: {
        fg: "cyan",
        bg: "black",
      },
    },
    padding,
    margin,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ButtonsPanelProps} props
 * @param {{action: string, pos: number}[]} actions
 */
function assertButtonsPanel(result, props, actions) {
  const buttonsWidth =
    actions.map((_) => _.action.length).reduce((_1, _2) => _1 + _2) +
    (actions.length - 1) * (props.margin ? props.margin : 0);

  assertComponents(
    result.children,
    h(
      "box",
      {
        width: buttonsWidth,
        height: 1,
        top: props.top,
        left: "center",
        style: props.style,
      },
      ...actions.map(({ action, pos }) => {
        return h(buttonComp, {
          left: pos,
          top: 0,
          label: action,
          style: props.style,
          onPress: mockFunction(),
        });
      })
    )
  );
}
