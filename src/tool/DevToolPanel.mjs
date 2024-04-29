import React from "react";
import LogPanel from "./LogPanel.mjs";
import InputController from "./InputController.mjs";
import ColorPanel from "./ColorPanel.mjs";
import Theme from "../theme/Theme.mjs";
import DevTool from "./DevTool.mjs";
import * as UI from "../UI.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly devTool: import("./DevTool.mjs").DevTool;
 *  readonly logContent: string;
 *  onActivate(devTool: import("./DevTool.mjs").DevTool): void;
 * }} DevToolPanelProps
 */

/**
 * @type {Array<{tool: import("./DevTool.mjs").DevTool, name: string}>}
 */
const tools = [
  {
    tool: DevTool.Logs,
    name: "Logs",
  },
  {
    tool: DevTool.Inputs,
    name: "Inputs",
  },
  {
    tool: DevTool.Colors,
    name: "Colors",
  },
];

/**
 * @param {DevToolPanelProps} props
 * @returns {React.ReactElement | null}
 */
const getDevToolComp = (props) => {
  const { logPanelComp, inputController, colorPanelComp } = DevToolPanel;

  switch (props.devTool) {
    case DevTool.Hidden:
      return null;
    case DevTool.Logs:
      return h(logPanelComp, { content: props.logContent });
    case DevTool.Inputs:
      return h(inputController);
    case DevTool.Colors:
      return h(colorPanelComp);
  }
};

/**
 * @param {DevToolPanelProps} props
 */
const DevToolPanel = (props) => {
  const theme = Theme.useTheme().popup.menu;
  const comp = getDevToolComp(props);

  let width = 0;
  const tabs = tools.map(({ tool, name }) => {
    const pos = width;
    const label = ` ${name} `;
    width = pos + label.length;

    const style = tool === props.devTool ? theme.focus ?? theme : theme;
    const content = UI.renderText2(style, label);

    return h("text", {
      key: label,
      autoFocus: false,
      clickable: true,
      tags: true,
      mouse: true,
      left: pos,
      onClick: () => {
        props.onActivate(tool);
      },
      content,
    });
  });

  return h(
    React.Fragment,
    null,
    h(
      "box",
      { width: "100%", height: 1, style: theme },
      h("box", { width, height: 1, left: "center" }, ...tabs)
    ),
    h("box", { top: 1 }, comp)
  );
};

DevToolPanel.displayName = "DevToolPanel";
DevToolPanel.logPanelComp = LogPanel;
DevToolPanel.inputController = InputController;
DevToolPanel.colorPanelComp = ColorPanel;

export default DevToolPanel;
