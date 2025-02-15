export default DevToolPanel;
export type DevToolPanelProps = {
    readonly devTool: import("./DevTool.mjs").DevTool;
    readonly logContent: string;
    onActivate(devTool: import("./DevTool.mjs").DevTool): void;
};
/**
 * @param {DevToolPanelProps} props
 */
declare function DevToolPanel(props: DevToolPanelProps): React.FunctionComponentElement<{}>;
declare namespace DevToolPanel {
    export let displayName: string;
    export { LogPanel as logPanelComp };
    export { InputController as inputController };
    export { ColorPanel as colorPanelComp };
}
import React from "react";
import LogPanel from "./LogPanel.mjs";
import InputController from "./InputController.mjs";
import ColorPanel from "./ColorPanel.mjs";
