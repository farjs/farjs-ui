/**
 * @typedef {import("../../src/theme/Theme.mjs").Theme} Theme
 * @typedef {import("../../src/tool/DevTool.mjs").DevTool} DevTool
 * @typedef {import("../../src/app/AppRoot.mjs").LoadResult} LoadResult
 * @typedef {import("../../src/app/AppRoot.mjs").AppRootProps} AppRootProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponent, assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TaskManager from "../../src/task/TaskManager.mjs";
import LogController from "../../src/tool/LogController.mjs";
import DevTool from "../../src/tool/DevTool.mjs";
import DevToolPanel from "../../src/tool/DevToolPanel.mjs";
import Theme from "../../src/theme/Theme.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import XTerm256Theme from "../../src/theme/XTerm256Theme.mjs";
import AppRoot from "../../src/app/AppRoot.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

AppRoot.taskControllerComp = mockComponent(TaskManager);
AppRoot.logControllerComp = mockComponent(LogController);
AppRoot.devToolPanelComp = mockComponent(DevToolPanel);
const { taskControllerComp, logControllerComp, devToolPanelComp } = AppRoot;

const mainComp = () => {
  return h(React.Fragment, null);
};
/** @type {() => Promise<LoadResult>} */
const mainUiP = () =>
  Promise.resolve({ theme: XTerm256Theme, mainUi: mainComp });

describe("AppRoot.test.mjs", () => {
  it("should set devTool and emit resize event when on F12", async () => {
    //given
    const props = getAppRootProps(mainUiP, DevTool.Hidden, DefaultTheme);
    const emitMock = mockFunction((eventName) => {
      assert.deepEqual(eventName, "resize");
    });
    const program = { emit: emitMock };
    let keyListener = /** @type {any} */ (null);
    const onMock = mockFunction((eventName, listener) => {
      assert.deepEqual(eventName, "keypress");
      keyListener = listener;
    });
    const offMock = mockFunction((eventName, listener) => {
      assert.deepEqual(eventName, "keypress");
      assert.deepEqual(listener, keyListener);
    });
    const screen = { program, on: onMock, off: offMock };
    const boxMock = { screen };
    const renderer = TestRenderer.create(h(AppRoot, props), {
      createNodeMock: (el) => {
        return el.type === "box" ? boxMock : null;
      },
    });
    assert.deepEqual(onMock.times, 1);
    assert.deepEqual(renderer.root.findByType("box").props.width, "100%");

    //when
    TestRenderer.act(() => {
      keyListener(null, { full: "f12" });
    });

    //then
    assert.deepEqual(renderer.root.findByType("box").props.width, "70%");
    await Promise.resolve().then(() => {
      assert.deepEqual(emitMock.times, 1);
    });

    //when
    TestRenderer.act(() => {
      renderer.unmount();
    });

    //then
    assert.deepEqual(offMock.times, 1);
  });

  it("should set devTool when onActivate", () => {
    //given
    const props = getAppRootProps(mainUiP, DevTool.Colors, DefaultTheme);
    const onMock = mockFunction((eventName) => {
      assert.deepEqual(eventName, "keypress");
    });
    const offMock = mockFunction();
    const screen = { on: onMock, off: offMock };
    const boxMock = { screen };
    const renderer = TestRenderer.create(h(AppRoot, props), {
      createNodeMock: (el) => {
        return el.type === "box" ? boxMock : null;
      },
    });
    assert.deepEqual(onMock.times, 1);

    function getDetToolProps() {
      const logCompProps = renderer.root.findByType(logControllerComp).props;
      const renderedContent = TestRenderer.create(
        logCompProps.render("test log content")
      ).root;
      return renderedContent.findByType(devToolPanelComp).props;
    }
    const devToolProps = getDetToolProps();
    assert.deepEqual(devToolProps.devTool, DevTool.Colors);

    //when
    TestRenderer.act(() => {
      devToolProps.onActivate(DevTool.Logs);
    });

    //then
    assert.deepEqual(getDetToolProps().devTool, DevTool.Logs);
  });

  it("should log error when onReady fails", async () => {
    //given
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction((error) => {
      console.error = savedConsoleError;
      assert.deepEqual(`${error}`, "Error: test error");
    });
    console.error = consoleErrorMock;
    /** @type {Promise<LoadResult>} */
    const mainUiP = Promise.reject(new Error("test error"));
    const props = getAppRootProps(() => mainUiP, DevTool.Hidden, DefaultTheme);
    const onMock = mockFunction((eventName) => {
      assert.deepEqual(eventName, "keypress");
    });
    const offMock = mockFunction();
    const screen = { on: onMock, off: offMock };
    const boxMock = { screen };
    const renderer = TestRenderer.create(h(AppRoot, props), {
      createNodeMock: (el) => {
        return el.type === "box" ? boxMock : null;
      },
    });
    assert.deepEqual(onMock.times, 1);
    const logCompProps = renderer.root.findByType(logControllerComp).props;

    //when
    logCompProps.onReady();

    //then
    await Promise.resolve().then(() => {});
    assert.deepEqual(consoleErrorMock.times, 1);
  });

  it("should render mainUi when onReady succeeds", async () => {
    //given
    const [themeCtx, mainComp] = getThemeCtxHook();
    /** @type {Promise<LoadResult>} */
    const mainUiP = Promise.resolve({ theme: XTerm256Theme, mainUi: mainComp });
    const props = getAppRootProps(() => mainUiP, DevTool.Hidden, DefaultTheme);
    const onMock = mockFunction((eventName) => {
      assert.deepEqual(eventName, "keypress");
    });
    const offMock = mockFunction();
    const screen = { on: onMock, off: offMock };
    const boxMock = { screen };
    const renderer = TestRenderer.create(h(AppRoot, props), {
      createNodeMock: (el) => {
        return el.type === "box" ? boxMock : null;
      },
    });
    assert.deepEqual(onMock.times, 1);

    assertComponents(
      renderer.root.children,
      h("box", { width: "100%" }, h("text", null, "Loading...")),
      h(logControllerComp)
    );
    const logCompProps = renderer.root.findByType(logControllerComp).props;
    assert.deepEqual(logCompProps.render("test log content"), null);

    //when
    await TestRenderer.act(async () => {
      logCompProps.onReady();
    });

    //then
    await Promise.resolve();
    await Promise.resolve();
    assert.deepEqual(themeCtx.current, XTerm256Theme);
    assertComponents(
      renderer.root.children,
      h("box", { width: "100%" }, h(mainComp, null, h(taskControllerComp))),
      h(logControllerComp)
    );
  });

  it("should render component without DevTools", () => {
    //given
    const props = getAppRootProps(mainUiP, DevTool.Hidden, DefaultTheme);
    const onMock = mockFunction((eventName) => {
      assert.deepEqual(eventName, "keypress");
    });
    const offMock = mockFunction();
    const screen = { on: onMock, off: offMock };
    const boxMock = { screen };

    //when
    const renderer = TestRenderer.create(h(AppRoot, props), {
      createNodeMock: (el) => {
        return el.type === "box" ? boxMock : null;
      },
    });

    //then
    assert.deepEqual(onMock.times, 1);
    assertComponents(
      renderer.root.children,
      h("box", { width: "100%" }, h("text", null, "Loading...")),
      h(logControllerComp)
    );
    const logCompProps = renderer.root.findByType(logControllerComp).props;
    assert.deepEqual(logCompProps.render("test log content"), null);
  });

  it("should render component with DevTools", () => {
    //given
    const props = getAppRootProps(mainUiP, DevTool.Logs, DefaultTheme);
    const onMock = mockFunction((eventName) => {
      assert.deepEqual(eventName, "keypress");
    });
    const offMock = mockFunction();
    const screen = { on: onMock, off: offMock };
    const boxMock = { screen };

    //when
    const renderer = TestRenderer.create(h(AppRoot, props), {
      createNodeMock: (el) => {
        return el.type === "box" ? boxMock : null;
      },
    });

    //then
    assert.deepEqual(onMock.times, 1);
    assertComponents(
      renderer.root.children,
      h("box", { width: "70%" }, h("text", null, "Loading...")),
      h(logControllerComp)
    );
    const logCompProps = renderer.root.findByType(logControllerComp).props;
    const content = "test log content";
    assertComponent(
      TestRenderer.create(logCompProps.render(content)).root,
      h(
        "box",
        { width: "30%", height: "100%", left: "70%" },
        h(devToolPanelComp, {
          devTool: DevTool.Logs,
          logContent: content,
          onActivate: mockFunction(),
        })
      )
    );
  });
});

/**
 * @param {(dispatch: (a: any) => void) => Promise<LoadResult>} loadMainUi
 * @param {DevTool} initialDevTool
 * @param {Theme} defaultTheme
 * @returns {AppRootProps}
 */
function getAppRootProps(loadMainUi, initialDevTool, defaultTheme) {
  return {
    loadMainUi,
    initialDevTool,
    defaultTheme,
  };
}

/**
 * @returns {[React.MutableRefObject<Theme | null>, React.FC]}
 */
function getThemeCtxHook() {
  /** @type {React.MutableRefObject<Theme | null>} */
  const ref = React.createRef();
  /**
   * @param {React.PropsWithChildren<{}>} props
   */
  const comp = (props) => {
    const ctx = Theme.useTheme();
    ref.current = ctx;
    return h(React.Fragment, null, props.children);
  };

  return [ref, comp];
}
