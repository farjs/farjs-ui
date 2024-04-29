/**
 * @typedef {{
 *  readonly label: string;
 *  readonly triggeredOnClose: boolean;
 *  onAction(): void;
 * }} MessageBoxAction
 */

/**
 * @param {string} label
 * @param {boolean} triggeredOnClose
 * @returns {(onAction: () => void) => MessageBoxAction}
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
