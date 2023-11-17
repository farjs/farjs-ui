/**
 * @typedef {import("./TaskManagerUi").TaskManagerUiProps} TaskManagerUiProps
 */
import React, { useState, useLayoutEffect } from "react";
import StatusPopup from "../popup/StatusPopup.mjs";
import MessageBox from "../popup/MessageBox.mjs";
import MessageBoxAction from "../popup/MessageBoxAction.mjs";
import Theme from "../theme/Theme.mjs";

const h = React.createElement;

/**
 * @param {string} error
 * @returns {string}
 */
function stripErrorPrefix(error) {
  const prefix = "Error:";
  if (error.startsWith(prefix)) {
    return error.slice(prefix.length).trim();
  }

  return error;
}

/**
 * @param {TaskManagerUiProps} props
 */
const TaskManagerUi = (props) => {
  const { statusPopupComp, messageBoxComp } = TaskManagerUi;

  const [errors, updateErrors] = useState(/** @type {string[]} */ ([]));
  const statusMessage = (props.showLoading ? props.status : undefined) ?? "";
  const errorMessage = (props.error ?? "").trim();
  const theme = Theme.useTheme().popup;

  useLayoutEffect(() => {
    if (errorMessage) {
      updateErrors((errors) => [errorMessage, ...errors]);
    }
    return undefined;
  }, [errorMessage]);

  return h(
    React.Fragment,
    null,
    statusMessage
      ? h(statusPopupComp, { text: statusMessage })
      : errors.length > 0
      ? h(messageBoxComp, {
          title: "Error",
          message: stripErrorPrefix(errors[0]),
          actions: [
            MessageBoxAction.OK(() => {
              updateErrors((_) => _.slice(1));
              props.onCloseErrorPopup();
            }),
          ],
          style: theme.error,
        })
      : null
  );
};

TaskManagerUi.displayName = "TaskManagerUi";
TaskManagerUi.statusPopupComp = StatusPopup;
TaskManagerUi.messageBoxComp = MessageBox;

export default TaskManagerUi;
