export default TaskAction;
/**
 * <T>
 */
export type Task<T> = import("./Task.mjs").Task<T>;
/**
 * <T>
 */
export type TaskAction<T> = {
    readonly task: Task<T>;
};
/**
 * @template T
 * @typedef {import("./Task.mjs").Task<T>} Task<T>
 */
/**
 * @template T
 * @typedef {{
 *  readonly task: Task<T>;
 * }} TaskAction<T>
 */
/**
 * @template T
 * @param {Task<T>} task
 * @returns {TaskAction<T>}
 */
declare function TaskAction<T>(task: Task<T>): TaskAction<T>;
