export default AppRoot;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type IKeyEventArg = import("@farjs/blessed").Widgets.Events.IKeyEventArg & {
    defaultPrevented?: boolean;
};
export type Theme = import("../theme/Theme.mjs").Theme;
export type DevTool = import("../tool/DevTool.mjs").DevTool;
export type MainUi = React.FC | React.ComponentClass<{}>;
export type LoadResult = {
    readonly theme: Theme;
    readonly mainUi: MainUi;
};
export type AppRootProps = {
    readonly initialDevTool: DevTool;
    readonly defaultTheme: Theme;
    loadMainUi(dispatch: (a: any) => void): Promise<LoadResult>;
};
/**
 * @typedef {React.FC | React.ComponentClass<{}>} MainUi
 */
/**
 * @typedef {{
 *  readonly theme: Theme;
 *  readonly mainUi: MainUi;
 * }} LoadResult
 */
/**
 * @typedef {{
 *  readonly initialDevTool: DevTool;
 *  readonly defaultTheme: Theme;
 *  loadMainUi(dispatch: (a: any) => void): Promise<LoadResult>;
 * }} AppRootProps
 */
/**
 * @param {AppRootProps} props
 */
declare function AppRoot(props: AppRootProps): React.FunctionComponentElement<React.ProviderProps<import("../theme/Theme.mjs").Theme | null>>;
declare namespace AppRoot {
    export let displayName: string;
    export { TaskManager as taskControllerComp };
    export { LogController as logControllerComp };
    export { DevToolPanel as devToolPanelComp };
}
import React from "react";
import TaskManager from "../task/TaskManager.mjs";
import LogController from "../tool/LogController.mjs";
import DevToolPanel from "../tool/DevToolPanel.mjs";
