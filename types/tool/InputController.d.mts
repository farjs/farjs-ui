export default InputController;
declare function InputController(): React.FunctionComponentElement<{
    content: string;
}>;
declare namespace InputController {
    export const displayName: string;
    export { LogPanel as logPanelComp };
    export const maxBufferLength: number;
}
import React from "react";
import LogPanel from "./LogPanel.mjs";
