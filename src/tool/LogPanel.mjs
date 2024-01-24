/**
 * @typedef {import("./LogPanel").LogPanelProps} LogPanelProps
 */
import React from "react";

const h = React.createElement;

/**
 * @type {import("blessed").Widgets.Types.TStyle}
 */
const style = {
  scrollbar: {
    bg: "cyan",
  },
};

/**
 * @param {LogPanelProps} props
 */
const LogPanel = (props) => {
  return h("log", {
    autoFocus: false,
    mouse: true,
    style: style,
    scrollbar: true,
    scrollable: true,
    alwaysScroll: true,
    content: props.content,
  });
};

LogPanel.displayName = "LogPanel";

export default LogPanel;
