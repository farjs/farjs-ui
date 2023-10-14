/**
 * @typedef {import("../../src/task/Task").Task<any>} Task
 * @typedef {import("../../src/task/TaskManager").TaskManagerProps} TaskManagerProps
 * @typedef {import("../../src/task/TaskManagerUi").TaskManagerUiProps} TaskManagerUiProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import {
  TestErrorBoundary,
  assertComponents,
  mockComponent,
} from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import Task from "../../src/task/Task.mjs";
import TaskManager from "../../src/task/TaskManager.mjs";
import TaskManagerUi from "../../src/task/TaskManagerUi.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

TaskManager.uiComponent = mockComponent(TaskManagerUi);
const { uiComponent } = TaskManager;

describe("TaskManager.test.mjs", () => {
  it("should fail if uiComponent is not set when render", () => {
    //given
    const savedUiComponent = TaskManager.uiComponent;
    // @ts-ignore
    TaskManager.uiComponent = undefined;
    // suppress intended error
    // see: https://github.com/facebook/react/issues/11098#issuecomment-412682721
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction(() => {
      console.error = savedConsoleError;
      TaskManager.uiComponent = savedUiComponent;
    });
    console.error = consoleErrorMock;
    const props = getTaskManagerProps(undefined);

    const Wrapper = () => {
      return h(TaskManager, props);
    };

    //when
    const result = TestRenderer.create(
      h(TestErrorBoundary, null, h(Wrapper))
    ).root;

    //then
    assert.deepEqual(consoleErrorMock.times, 1);
    assert.deepEqual(console.error, savedConsoleError);
    assert.deepEqual(TaskManager.uiComponent, savedUiComponent);
    assertComponents(
      result.children,
      h("div", null, "Error: TaskManager.uiComponent is not specified")
    );
  });

  it("should set status to None when onHideStatus", () => {
    //given
    const task = Task("Fetching data", Promise.resolve());
    const props = getTaskManagerProps(task);
    const renderer = TestRenderer.create(h(TaskManager, props));
    assertTaskManager(renderer.root, {
      showLoading: true,
      status: new RegExp(`^${task.message}\\.\\.\\.$`),
    });
    const uiProps = renderer.root.findByType(uiComponent).props;

    //when
    uiProps.onHideStatus();

    //then
    assertTaskManager(renderer.root, { showLoading: true });
  });

  it("should log stack if js error and set error to undefined when onCloseErrorPopup", async () => {
    //given
    const error = new Error("Test error");
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction((msg) => {
      console.error = savedConsoleError;
      assert.deepEqual(msg, error.stack);
    });
    console.error = consoleErrorMock;
    const rejected = Promise.reject(error);
    const task = Task("Fetching data", rejected);
    const props = getTaskManagerProps(task);
    const renderer = TestRenderer.create(h(TaskManager, props));
    assertTaskManager(renderer.root, {
      showLoading: true,
      status: new RegExp(`^${task.message}\\.\\.\\.$`),
    });

    await rejected.catch((error) => {
      //then
      assert.deepEqual(consoleErrorMock.times, 1);
      assert.deepEqual(console.error, savedConsoleError);
      assertTaskManager(renderer.root, {
        showLoading: false,
        status: new RegExp(`^${task.message}\\.\\.\\.Done \\d+\\.\\d+ sec\\.$`),
        error: `${error}`,
        errorDetails: error.stack,
      });
      const uiProps = renderer.root.findByType(uiComponent).props;

      //when
      uiProps.onCloseErrorPopup();

      //then
      assertTaskManager(renderer.root, {
        showLoading: false,
        status: new RegExp(`^${task.message}\\.\\.\\.Done \\d+\\.\\d+ sec\\.$`),
      });
    });
  });

  it("should log error when non-js error", async () => {
    //given
    const error = "Test error";
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction((msg) => {
      console.error = savedConsoleError;
      assert.deepEqual(msg, `${error}`);
    });
    console.error = consoleErrorMock;
    const rejected = Promise.reject(error);
    const task = Task("Fetching data", rejected);
    const props = getTaskManagerProps(task);

    //when
    const renderer = TestRenderer.create(h(TaskManager, props));
    assertTaskManager(renderer.root, {
      showLoading: true,
      status: new RegExp(`^${task.message}\\.\\.\\.$`),
    });

    await rejected.catch((error) => {
      //then
      assert.deepEqual(consoleErrorMock.times, 1);
      assert.deepEqual(console.error, savedConsoleError);
      assertTaskManager(renderer.root, {
        showLoading: false,
        status: new RegExp(`^${task.message}\\.\\.\\.Done \\d+\\.\\d+ sec\\.$`),
        error: `${error}`,
        errorDetails: undefined,
      });
    });
  });

  it("should render status of concurrent tasks", async () => {
    //given
    let resolve1 = /** @type {((value: any) => void) | undefined} */ (
      undefined
    );
    const promise1 = new Promise((_) => (resolve1 = _));
    const task1 = Task("Fetching data 1", promise1);
    const props = getTaskManagerProps(task1);

    //when & then
    const renderer = TestRenderer.create(h(TaskManager, props));
    assertTaskManager(renderer.root, {
      showLoading: true,
      status: new RegExp(`^${task1.message}\\.\\.\\.$`),
    });

    //given
    let resolve2 = /** @type {((value: any) => void) | undefined} */ (
      undefined
    );
    const promise2 = new Promise((_) => (resolve2 = _));
    const task2 = Task("Fetching data 2", promise2);

    //when & then
    TestRenderer.act(() => {
      renderer.update(h(TaskManager, getTaskManagerProps(task2)));
    });
    assertTaskManager(renderer.root, {
      showLoading: true,
      status: new RegExp(`^${task2.message}\\.\\.\\.$`),
    });

    //when & then
    assert.notDeepEqual(resolve1, undefined);
    resolve1?.apply(null, [undefined]);
    await promise1;
    assertTaskManager(renderer.root, {
      showLoading: true,
      status: new RegExp(`^${task1.message}\\.\\.\\.Done \\d+\\.\\d+ sec\\.$`),
    });

    //when & then
    assert.notDeepEqual(resolve2, undefined);
    resolve2?.apply(null, [undefined]);
    await promise2;
    assertTaskManager(renderer.root, {
      showLoading: false,
      status: new RegExp(`^${task2.message}\\.\\.\\.Done \\d+\\.\\d+ sec\\.$`),
    });
  });

  it("should format duration in seconds properly", () => {
    //when & then
    assert.deepEqual((0.0).toFixed(3), "0.000");
    assert.deepEqual((0.003).toFixed(3), "0.003");
    assert.deepEqual((0.022).toFixed(3), "0.022");
    assert.deepEqual((0.033).toFixed(3), "0.033");
    assert.deepEqual((0.33).toFixed(3), "0.330");
    assert.deepEqual((0.333).toFixed(3), "0.333");
    assert.deepEqual((1.132).toFixed(3), "1.132");
    assert.deepEqual((1.333).toFixed(3), "1.333");
  });
});

/**
 * @param {Task} [task]
 * @returns {TaskManagerProps}
 */
function getTaskManagerProps(task) {
  return {
    startTask: task,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {{showLoading: boolean, onHideStatus?(): void, onCloseErrorPopup?(): void, status?: RegExp, error?: string, errorDetails?: string}} props
 */
function assertTaskManager(result, props) {
  const uiProps = result.findByType(uiComponent).props;
  const status = uiProps.status;
  if (props.status) {
    assert.deepEqual(
      props.status.test(status),
      true,
      `actual: ${status}, expected: ${props.status}`
    );
  }

  assertComponents(
    result.children,
    h(uiComponent, {
      onHideStatus: () => {},
      onCloseErrorPopup: () => {},
      ...props,
      status,
    })
  );
}
