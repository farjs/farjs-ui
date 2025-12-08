export default MessageBoxAction;
export type MessageBoxAction = {
    readonly label: string;
    readonly triggeredOnClose: boolean;
    onAction(): void;
};
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
declare function MessageBoxAction(label: string, triggeredOnClose?: boolean): (onAction: () => void) => MessageBoxAction;
declare namespace MessageBoxAction {
    let OK: (onAction: () => void) => MessageBoxAction;
    let YES: (onAction: () => void) => MessageBoxAction;
    let NO: (onAction: () => void) => MessageBoxAction;
}
//# sourceMappingURL=MessageBoxAction.d.mts.map