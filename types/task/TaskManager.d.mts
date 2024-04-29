export default TaskManager;
/**
 * <T>
 */
export type Task<T> = import("./Task.mjs").Task<T>;
export type TaskManagerUiProps = import("./TaskManagerUi.mjs").TaskManagerUiProps;
export type TaskManagerProps = {
    readonly startTask?: Task<any>;
};
export type TaskManagerState = {
    readonly taskCount: number;
    readonly status?: string;
    readonly error?: string;
    readonly errorDetails?: string;
};
export type TaskError = {
    readonly error: string;
    readonly errorDetails?: string;
};
/**
 * @typedef {{
 *  readonly startTask?: Task<any>;
 * }} TaskManagerProps
 */
/**
 * @typedef {{
 *  readonly taskCount: number;
 *  readonly status?: string;
 *  readonly error?: string;
 *  readonly errorDetails?: string;
 * }} TaskManagerState
 */
/**
 * @param {TaskManagerProps} props
 */
declare function TaskManager(props: TaskManagerProps): React.ReactElement<import("./TaskManagerUi.mjs").TaskManagerUiProps, string | React.JSXElementConstructor<any>>;
declare namespace TaskManager {
    export const displayName: string;
    export { TaskManagerUi as uiComponent };
    export function errorHandler(error: any): TaskError;
}
import React from "react";
import TaskManagerUi from "./TaskManagerUi.mjs";
