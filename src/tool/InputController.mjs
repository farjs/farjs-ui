import React, { useState, useLayoutEffect } from "react";
import LogPanel from "./LogPanel.mjs";

const h = React.createElement;

const InputController = () => {
  const { logPanelComp, maxBufferLength } = InputController;
  const [content, setContent] = useState("");
  const g = global;

  useLayoutEffect(() => {
    /**
     * @param {string} msg
     */
    const logKeys = (msg) => {
      setContent((c) => {
        const buf = `${c}${msg}\n`;
        if (buf.length > maxBufferLength) {
          const cutAt = buf.indexOf("\n", buf.length - maxBufferLength);
          return buf.substring(cutAt + 1);
        }
        return buf;
      });
    };
    g.farjsLogKeys = logKeys;

    return () => {
      g.farjsLogKeys = undefined;
    };
  }, []);

  return h(logPanelComp, {
    content,
  });
};

InputController.displayName = "InputController";
InputController.logPanelComp = LogPanel;
InputController.maxBufferLength = 4000;

export default InputController;
