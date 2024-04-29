/**
 * @typedef {import("../../src/task/TaskManagerUi.mjs").TaskManagerUiProps} TaskManagerUiProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import withThemeContext from "../theme/withThemeContext.mjs";
import MessageBox from "../../src/popup/MessageBox.mjs";
import StatusPopup from "../../src/popup/StatusPopup.mjs";
import TaskManagerUi from "../../src/task/TaskManagerUi.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

TaskManagerUi.statusPopupComp = mockComponent(StatusPopup);
TaskManagerUi.messageBoxComp = mockComponent(MessageBox);
const { statusPopupComp, messageBoxComp } = TaskManagerUi;

describe("TaskManagerUi.test.mjs", () => {
  it("should call onCloseErrorPopup function when OK action in error popup", () => {
    //given
    const onCloseErrorPopup = mockFunction();
    const props = getTaskManagerUiProps(
      false,
      onCloseErrorPopup,
      undefined,
      "Some error"
    );
    const renderer = TestRenderer.create(
      withThemeContext(h(TaskManagerUi, props))
    );
    const msgBox = renderer.root.findByType(messageBoxComp);

    //when
    msgBox.props.actions[0].onAction();

    //then
    assert.deepEqual(onCloseErrorPopup.times, 1);
    assert.deepEqual(renderer.root.children.length, 0);
  });

  it("should not hide previous error popup when no error in updated props", () => {
    //given
    const onCloseErrorPopup = mockFunction();
    const props = getTaskManagerUiProps(
      false,
      onCloseErrorPopup,
      undefined,
      "Some error"
    );
    const renderer = TestRenderer.create(
      withThemeContext(h(TaskManagerUi, props))
    );
    assert.deepEqual(
      renderer.root.findByType(messageBoxComp).props.message,
      "Some error"
    );

    //when
    TestRenderer.act(() => {
      renderer.update(
        withThemeContext(h(TaskManagerUi, { ...props, error: undefined }))
      );
    });

    //then
    assert.deepEqual(onCloseErrorPopup.times, 0);
    assert.deepEqual(
      renderer.root.findByType(messageBoxComp).props.message,
      "Some error"
    );
  });

  it("should stack error popups when several failed tasks", () => {
    //given
    const onCloseErrorPopup = mockFunction();
    const props = getTaskManagerUiProps(
      false,
      onCloseErrorPopup,
      undefined,
      "Some error"
    );
    const renderer = TestRenderer.create(
      withThemeContext(h(TaskManagerUi, props))
    );
    assert.deepEqual(
      renderer.root.findByType(messageBoxComp).props.message,
      "Some error"
    );

    //when & then
    TestRenderer.act(() => {
      renderer.update(
        withThemeContext(h(TaskManagerUi, { ...props, error: "Test error2" }))
      );
    });
    assert.deepEqual(
      renderer.root.findByType(messageBoxComp).props.message,
      "Test error2"
    );

    //when & then
    renderer.root.findByType(messageBoxComp).props.actions[0].onAction();
    assert.deepEqual(onCloseErrorPopup.times, 1);
    assert.deepEqual(
      renderer.root.findByType(messageBoxComp).props.message,
      "Some error"
    );

    //when & then
    renderer.root.findByType(messageBoxComp).props.actions[0].onAction();
    assert.deepEqual(onCloseErrorPopup.times, 2);
    assert.deepEqual(renderer.root.children.length, 0);
  });

  it("should render only status popup if loading and prev error", () => {
    //given
    const onCloseErrorPopup = mockFunction();
    const props = getTaskManagerUiProps(
      true,
      onCloseErrorPopup,
      "Some status message",
      "Error: \nSome prev error ",
      "Some prev error details"
    );

    //when
    const result = TestRenderer.create(
      withThemeContext(h(TaskManagerUi, props))
    ).root;

    //then
    assert.deepEqual(onCloseErrorPopup.times, 0);
    assertComponents(
      result.children,
      h(statusPopupComp, {
        text: props.status ?? "",
        title: undefined,
        onClose: undefined,
      })
    );
  });

  it("should render MessageBox if error and no status/loading", () => {
    //given
    const onCloseErrorPopup = mockFunction();
    const props = getTaskManagerUiProps(
      false,
      onCloseErrorPopup,
      "Test status...",
      "Error: \nSome error ",
      "Some error details"
    );

    //when
    const result = TestRenderer.create(
      withThemeContext(h(TaskManagerUi, props))
    ).root;

    //then
    assert.deepEqual(onCloseErrorPopup.times, 0);
    assertComponents(
      result.children,
      h(messageBoxComp, {
        title: "Error",
        message: "Some error",
        actions: [
          {
            label: "OK",
            triggeredOnClose: true,
            onAction: mockFunction(),
          },
        ],
        style: DefaultTheme.popup.error,
      })
    );
  });

  it("should render nothing if no loading and no error", () => {
    //given
    const onCloseErrorPopup = mockFunction();
    const props = getTaskManagerUiProps(false, onCloseErrorPopup);

    //when
    const result = TestRenderer.create(
      withThemeContext(h(TaskManagerUi, props))
    ).root;

    //then
    assert.deepEqual(onCloseErrorPopup.times, 0);
    assert.deepEqual(result.children.length, 0);
  });
});

/**
 * @param {boolean} showLoading
 * @param {() => void} onCloseErrorPopup
 * @param {string} [status]
 * @param {string} [error]
 * @param {string} [errorDetails]
 * @returns {TaskManagerUiProps}
 */
function getTaskManagerUiProps(
  showLoading,
  onCloseErrorPopup,
  status,
  error,
  errorDetails
) {
  return {
    showLoading,
    onHideStatus: () => {},
    onCloseErrorPopup,
    status,
    error,
    errorDetails,
  };
}
