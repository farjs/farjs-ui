export default MessageBoxAction;
export type MessageBoxAction = {
    readonly label: string;
    readonly triggeredOnClose: boolean;
    onAction(): void;
};
declare namespace MessageBoxAction {
    function OK(onAction: () => void): MessageBoxAction;
    function YES(onAction: () => void): MessageBoxAction;
    function NO(onAction: () => void): MessageBoxAction;
}
