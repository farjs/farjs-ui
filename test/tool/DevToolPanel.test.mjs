/**
 * @typedef {import("../../src/tool/DevToolPanel").DevToolPanelProps} DevToolPanelProps
 * @typedef {import("../../src/tool/DevTool.mjs").DevToolType} DevToolType
 * @typedef {import("../../src/theme/Theme.mjs").ThemeType} ThemeType
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import mockFunction from "mock-fn";
import withThemeContext from "../theme/withThemeContext.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import XTerm256Theme from "../../src/theme/XTerm256Theme.mjs";
import * as UI from "../../src/UI.mjs";
import LogPanel from "../../src/tool/LogPanel.mjs";
import InputController from "../../src/tool/InputController.mjs";
import ColorPanel from "../../src/tool/ColorPanel.mjs";
import DevTool from "../../src/tool/DevTool.mjs";
import DevToolPanel from "../../src/tool/DevToolPanel.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

DevToolPanel.logPanelComp = mockComponent(LogPanel);
DevToolPanel.inputController = mockComponent(InputController);
DevToolPanel.colorPanelComp = mockComponent(ColorPanel);

const { logPanelComp, inputController, colorPanelComp } = DevToolPanel;

describe("DevToolPanel.test.mjs", () => {
  it("should call onActivate when click on tab", () => {
    //given
    const onActivate = mockFunction((devTool) => {
      assert.deepEqual(devTool, DevTool.Logs);
    });
    const props = getDevToolPanelProps(DevTool.Colors, "test logs", onActivate);
    const comp = TestRenderer.create(
      withThemeContext(h(DevToolPanel, props))
    ).root;
    const [tab1] = comp.findAllByType("text");

    //when
    tab1.props.onClick();

    //then
    assert.deepEqual(onActivate.times, 1);
  });

  it("should render Logs component", () => {
    //given
    const props = getDevToolPanelProps(DevTool.Logs, "test logs");

    //when
    const renderer = TestRenderer.create(
      withThemeContext(h(DevToolPanel, props))
    );

    //then
    assertDevToolPanel(
      renderer,
      " Logs ",
      h(logPanelComp, { content: props.logContent })
    );
  });

  it("should render Inputs component", () => {
    //given
    const currTheme = {
      ...DefaultTheme,
      popup: {
        ...DefaultTheme.popup,
        menu: {
          ...DefaultTheme.popup.menu,
          focus: undefined,
        },
      },
    };
    const props = getDevToolPanelProps(DevTool.Inputs, "test logs");

    //when
    const renderer = TestRenderer.create(
      withThemeContext(h(DevToolPanel, props), currTheme)
    );

    //then
    assertDevToolPanel(renderer, " Inputs ", h(inputController), currTheme);
  });

  it("should render Colors component", () => {
    //given
    const currTheme = XTerm256Theme;
    const props = getDevToolPanelProps(DevTool.Colors, "test logs");

    //when
    const renderer = TestRenderer.create(
      withThemeContext(h(DevToolPanel, props), currTheme)
    );

    //then
    assertDevToolPanel(renderer, " Colors ", h(colorPanelComp), currTheme);
  });

  it("should render null component", () => {
    //given
    const props = getDevToolPanelProps(DevTool.Hidden, "test logs");

    //when
    const renderer = TestRenderer.create(
      withThemeContext(h(DevToolPanel, props))
    );

    //then
    assertDevToolPanel(renderer, "", null);
  });
});

/**
 * @param {DevToolType} devTool
 * @param {string} logContent
 * @param {(devTool: DevToolType) => void} onActivate
 * @returns {DevToolPanelProps}
 */
function getDevToolPanelProps(devTool, logContent, onActivate = (_) => {}) {
  return {
    devTool,
    logContent,
    onActivate,
  };
}

/**
 * @typedef {{label: string, pos: number}} ExpectedTab
 */

/**
 * @param {string} label
 * @param {number} pos
 * @returns {ExpectedTab}
 */
function getExpectedTab(label, pos) {
  return {
    label,
    pos,
  };
}

/**
 * @type {Array<ExpectedTab>}
 */
const expectedTabs = [
  getExpectedTab(" Logs ", 0),
  getExpectedTab(" Inputs ", 6),
  getExpectedTab(" Colors ", 14),
];

/**
 * @param {TestRenderer.ReactTestRenderer} renderer
 * @param {string} activeTab
 * @param {React.ReactElement | null} expectedComp
 * @param {ThemeType} currTheme
 */
function assertDevToolPanel(
  renderer,
  activeTab,
  expectedComp,
  currTheme = DefaultTheme
) {
  assert.deepEqual(DevToolPanel.displayName, "DevToolPanel");

  const theme = currTheme.popup.menu;
  const width = expectedTabs
    .map(({ label }) => label.length)
    .reduce((_1, _2) => _1 + _2);

  assertComponents(
    renderer.root.children,
    h(
      "box",
      {
        width: "100%",
        height: 1,
        style: theme,
      },
      h(
        "box",
        {
          width,
          height: 1,
          left: "center",
        },
        ...expectedTabs.map(({ label, pos }) => {
          const style = label === activeTab ? theme.focus ?? theme : theme;
          const content = UI.renderText2(style, label);

          return h("text", {
            autoFocus: false,
            clickable: true,
            tags: true,
            mouse: true,
            left: pos,
            content,
          });
        })
      )
    ),
    h("box", { top: 1 }, expectedComp)
  );
}
