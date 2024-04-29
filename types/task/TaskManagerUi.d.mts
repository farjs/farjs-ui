export default TaskManagerUi;
export type TaskManagerUiProps = {
    readonly showLoading: boolean;
    onHideStatus(): void;
    onCloseErrorPopup(): void;
    readonly status?: string;
    readonly error?: string;
    readonly errorDetails?: string;
};
/**
 * @param {TaskManagerUiProps} props
 */
declare function TaskManagerUi(props: TaskManagerUiProps): React.FunctionComponentElement<{}>;
declare namespace TaskManagerUi {
    export const displayName: string;
    export { StatusPopup as statusPopupComp };
    export { MessageBox as messageBoxComp };
}
import React from "react";
import StatusPopup from "../popup/StatusPopup.mjs";
import MessageBox from "../popup/MessageBox.mjs";
