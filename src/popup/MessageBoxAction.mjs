/**
 * @typedef {{
 *  readonly label: string;
 *  readonly triggeredOnClose: boolean;
 *  onAction(): void;
 * }} MessageBoxAction
 */

/**
 * @param {string} label
 * @param {boolean} [triggeredOnClose]
 * @returns {(onAction: () => void) => MessageBoxAction}
 */
function MessageBoxAction(label, triggeredOnClose = false) {
  return (onAction) => {
    return {
      label,
      onAction,
      triggeredOnClose,
    };
  };
}

MessageBoxAction.OK = MessageBoxAction("OK", true);
MessageBoxAction.YES = MessageBoxAction("YES");
MessageBoxAction.NO = MessageBoxAction("NO", true);

export default MessageBoxAction;
