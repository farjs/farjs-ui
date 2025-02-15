export default MessageBoxAction;
export type MessageBoxAction = {
    readonly label: string;
    readonly triggeredOnClose: boolean;
    onAction(): void;
};
declare namespace MessageBoxAction {
    let OK: (onAction: () => void) => MessageBoxAction;
    let YES: (onAction: () => void) => MessageBoxAction;
    let NO: (onAction: () => void) => MessageBoxAction;
}
