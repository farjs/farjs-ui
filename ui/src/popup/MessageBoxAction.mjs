/**
 * @typedef {import("./MessageBoxAction").MessageBoxActionType} MessageBoxActionType
 */

/**
 * @param {string} label
 * @param {boolean} triggeredOnClose
 * @returns {(onAction: () => void) => MessageBoxActionType}
 */
function createAction(label, triggeredOnClose = false) {
  return (onAction) => {
    return {
      label,
      onAction,
      triggeredOnClose,
    };
  };
}

const MessageBoxAction = {
  OK: createAction("OK", true),
  YES: createAction("YES"),
  NO: createAction("NO", true),
};

export default MessageBoxAction;
