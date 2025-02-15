export default InputController;
declare function InputController(): React.FunctionComponentElement<{
    content: string;
}>;
declare namespace InputController {
    export let displayName: string;
    export { LogPanel as logPanelComp };
    export let maxBufferLength: number;
}
import React from "react";
import LogPanel from "./LogPanel.mjs";
