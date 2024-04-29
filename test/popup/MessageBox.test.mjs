/**
 * @typedef {import("../../src/popup/Popup.mjs").PopupProps} PopupProps
 * @typedef {import("../../src/ButtonsPanel.mjs").ButtonsPanelProps} ButtonsPanelProps
 * @typedef {import("../../src/popup/MessageBox.mjs").MessageBoxProps} MessageBoxProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import mockFunction from "mock-fn";
import * as UI from "../../src/UI.mjs";
import ButtonsPanel from "../../src/ButtonsPanel.mjs";
import TextAlign from "../../src/TextAlign.mjs";
import TextLine from "../../src/TextLine.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import Popup from "../../src/popup/Popup.mjs";
import ModalContent from "../../src/popup/ModalContent.mjs";
import MessageBoxAction from "../../src/popup/MessageBoxAction.mjs";
import MessageBox from "../../src/popup/MessageBox.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

MessageBox.popupComp = mockComponent(Popup);
MessageBox.modalContentComp = mockComponent(ModalContent);
MessageBox.textLineComp = mockComponent(TextLine);
MessageBox.buttonsPanelComp = mockComponent(ButtonsPanel);

const { popupComp, modalContentComp, textLineComp, buttonsPanelComp } =
  MessageBox;

describe("MessageBox.test.mjs", () => {
  it("OK popup: should call OK action when onClose popup", () => {
    //given
    const onAction = mockFunction();
    const props = {
      ...getMessageBoxProps(),
      actions: [MessageBoxAction.OK(onAction)],
    };
    const comp = TestRenderer.create(h(MessageBox, props)).root;
    const popupProps = findPopupProps(comp);

    //when
    popupProps.onClose?.apply(null);

    //then
    assert.deepEqual(onAction.times, 1);
  });

  it("OK popup: should call OK action when onPress OK button", () => {
    //given
    const onAction = mockFunction();
    const props = {
      ...getMessageBoxProps(),
      actions: [MessageBoxAction.OK(onAction)],
    };
    const comp = TestRenderer.create(h(MessageBox, props)).root;
    const buttonsPanelProps = findButtonsPanelProps(comp);

    //when
    buttonsPanelProps.actions[0].onAction();

    //then
    assert.deepEqual(onAction.times, 1);
  });

  it("OK popup: should render component", () => {
    //given
    const props = {
      ...getMessageBoxProps(),
      message:
        "Toooooooooooooooooooooooooooooo looooooooooooooooooooooooong test message",
      actions: [MessageBoxAction.OK(() => {})],
    };

    //when
    const result = TestRenderer.create(h(MessageBox, props)).root;

    //then
    assertMessageBox(result, props, ["OK"]);
  });

  it("YES/NO popup: should call NO action when onClose popup", () => {
    //given
    const onYesAction = mockFunction();
    const onNoAction = mockFunction();
    const props = {
      ...getMessageBoxProps(),
      actions: [
        MessageBoxAction.YES(onYesAction),
        MessageBoxAction.NO(onNoAction),
      ],
    };
    const comp = TestRenderer.create(h(MessageBox, props)).root;
    const popupProps = findPopupProps(comp);

    //when
    popupProps.onClose?.apply(null);

    //then
    assert.deepEqual(onYesAction.times, 0);
    assert.deepEqual(onNoAction.times, 1);
  });

  it("YES/NO popup: should call YES action when onPress YES button", () => {
    //given
    const onYesAction = mockFunction();
    const onNoAction = mockFunction();
    const props = {
      ...getMessageBoxProps(),
      actions: [
        MessageBoxAction.YES(onYesAction),
        MessageBoxAction.NO(onNoAction),
      ],
    };
    const comp = TestRenderer.create(h(MessageBox, props)).root;
    const buttonsPanelProps = findButtonsPanelProps(comp);

    //when
    buttonsPanelProps.actions[0].onAction();

    //then
    assert.deepEqual(onYesAction.times, 1);
    assert.deepEqual(onNoAction.times, 0);
  });

  it("YES/NO popup: should call NO action when onPress NO button", () => {
    //given
    const onYesAction = mockFunction();
    const onNoAction = mockFunction();
    const props = {
      ...getMessageBoxProps(),
      actions: [
        MessageBoxAction.YES(onYesAction),
        MessageBoxAction.NO(onNoAction),
      ],
    };
    const comp = TestRenderer.create(h(MessageBox, props)).root;
    const buttonsPanelProps = findButtonsPanelProps(comp);

    //when
    buttonsPanelProps.actions[1].onAction();

    //then
    assert.deepEqual(onYesAction.times, 0);
    assert.deepEqual(onNoAction.times, 1);
  });

  it("YES/NO popup: should render component", () => {
    //given
    const props = {
      ...getMessageBoxProps(),
      actions: [MessageBoxAction.YES(() => {}), MessageBoxAction.NO(() => {})],
    };

    //when
    const result = TestRenderer.create(h(MessageBox, props)).root;

    //then
    assertMessageBox(result, props, ["YES", "NO"]);
  });

  it("YES/NO non-closable popup: do nothing when onClose popup", () => {
    //given
    const onYesAction = mockFunction();
    const onNoAction = mockFunction();
    const props = {
      ...getMessageBoxProps(),
      actions: [
        MessageBoxAction.YES(onYesAction),
        { ...MessageBoxAction.NO(onNoAction), triggeredOnClose: false },
      ],
    };
    const comp = TestRenderer.create(h(MessageBox, props)).root;
    const popupProps = findPopupProps(comp);

    //when
    popupProps.onClose?.apply(null);

    //then
    assert.deepEqual(onYesAction.times, 0);
    assert.deepEqual(onNoAction.times, 0);
  });

  it("YES/NO non-closable popup: should render component", () => {
    //given
    const props = {
      ...getMessageBoxProps(),
      actions: [
        MessageBoxAction.YES(() => {}),
        { ...MessageBoxAction.NO(() => {}), triggeredOnClose: false },
      ],
    };

    //when
    const result = TestRenderer.create(h(MessageBox, props)).root;

    //then
    assertMessageBox(result, props, ["YES", "NO"], false);
  });
});

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @returns {PopupProps}
 */
function findPopupProps(result) {
  return /** @type {PopupProps} */ (result.findByType(popupComp).props);
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @returns {ButtonsPanelProps}
 */
function findButtonsPanelProps(result) {
  return /** @type {ButtonsPanelProps} */ (
    result.findByType(buttonsPanelComp).props
  );
}

/**
 * @returns {MessageBoxProps}
 */
function getMessageBoxProps() {
  return {
    title: "test title",
    message: "test message",
    actions: [],
    style: DefaultTheme.popup.regular,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {MessageBoxProps} props
 * @param {string[]} actions
 * @param {boolean} closable
 */
function assertMessageBox(result, props, actions, closable = true) {
  assert.deepEqual(MessageBox.displayName, "MessageBox");

  const width = 60;
  const textWidth = width - (ModalContent.paddingHorizontal + 2) * 2;
  const textLines = UI.splitText(props.message, textWidth);
  const height = (ModalContent.paddingVertical + 1) * 2 + textLines.length + 1;
  const buttonsPanelProps = findButtonsPanelProps(result);

  assertComponents(
    result.children,
    h(
      popupComp,
      {
        onClose: closable ? () => {} : undefined,
      },
      h(
        modalContentComp,
        {
          title: props.title,
          width: width,
          height: height,
          style: props.style,
          padding: undefined,
          left: undefined,
          footer: undefined,
        },
        [
          ...textLines.map((textLine, index) => {
            return h(textLineComp, {
              key: `${index}`,
              align: TextAlign.center,
              left: 2,
              top: 1 + index,
              width: width - 10,
              text: textLine,
              style: props.style,
              focused: undefined,
              padding: 0,
            });
          }),

          h(buttonsPanelComp, {
            key: `buttonsPanelComp`,
            top: 1 + textLines.length,
            actions: actions.map((label, index) => {
              return {
                label,
                onAction: buttonsPanelProps.actions[index].onAction,
              };
            }),
            style: props.style,
            padding: 1,
            margin: undefined,
          }),
        ]
      )
    )
  );
}
