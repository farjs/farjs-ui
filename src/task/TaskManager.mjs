/**
 * @typedef {import("./Task").Task<any>} Task
 * @typedef {import("./TaskError").TaskError} TaskError
 * @typedef {import("./TaskManager").TaskManagerProps} TaskManagerProps
 * @typedef {import("./TaskManagerUi").TaskManagerUiProps} TaskManagerUiProps
 */
import React, { useState, useLayoutEffect } from "react";
import TaskManagerUi from "./TaskManagerUi.mjs";

const h = React.createElement;

/**
 * @typedef {{taskCount: number, status?: string, error?: string, errorDetails?: string}} TaskManagerState
 */

/**
 * @param {TaskManagerProps} props
 */
const TaskManager = (props) => {
  const { uiComponent } = TaskManager;

  const [state, setState] = useState(
    /** @type {TaskManagerState} */ ({ taskCount: 0 })
  );

  if (!uiComponent) {
    throw new Error("TaskManager.uiComponent is not specified");
  }

  useLayoutEffect(() => {
    if (props.startTask) {
      onTaskStart(setState, props.startTask);
    }
    return undefined;
  }, [props.startTask]);

  return h(uiComponent, {
    showLoading: state.taskCount > 0,
    onHideStatus: () => {
      setState((s) => {
        return { ...s, status: undefined };
      });
    },
    onCloseErrorPopup: () => {
      setState((s) => {
        return { ...s, error: undefined, errorDetails: undefined };
      });
    },
    status: state.status,
    error: state.error,
    errorDetails: state.errorDetails,
  });
};

TaskManager.displayName = "TaskManager";
/**
 * @type {React.FunctionComponent<TaskManagerUiProps> | React.ComponentClass<TaskManagerUiProps>}
 */
TaskManager.uiComponent = TaskManagerUi;
/**
 * @type {(error: any) => TaskError}
 */
TaskManager.errorHandler = (error) => {
  const errorMsg = `${error}`;
  const errorStack = error?.stack;
  console.error(errorStack ?? errorMsg);

  return { error: errorMsg, errorDetails: errorStack };
};

/**
 * @param {React.Dispatch<React.SetStateAction<TaskManagerState>>} setState
 * @param {Task} task
 */
function onTaskStart(setState, task) {
  task.result.then(
    () => {
      onTaskFinish(setState, task, undefined);
    },
    (reason) => {
      onTaskFinish(setState, task, reason);
    }
  );

  setState((s) => {
    return { ...s, taskCount: s.taskCount + 1, status: `${task.message}...` };
  });
}

/**
 * @param {React.Dispatch<React.SetStateAction<TaskManagerState>>} setState
 * @param {Task} task
 * @param {any} [reason]
 */
function onTaskFinish(setState, task, reason) {
  const duration = (Date.now() - task.startTime) / 1000;
  const statusMessage = `${task.message}...Done ${duration.toFixed(3)} sec.`;
  const error = reason ? TaskManager.errorHandler(reason) : undefined;

  setState((s) => {
    return {
      ...s,
      taskCount: s.taskCount - 1,
      status: statusMessage,
      error: error?.error,
      errorDetails: error?.errorDetails,
    };
  });
}

export default TaskManager;
