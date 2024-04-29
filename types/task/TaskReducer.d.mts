export default TaskReducer;
/**
 * <T>
 */
export type Task<T> = import("./Task.mjs").Task<T>;
/**
 * @template T
 * @typedef {import("./Task.mjs").Task<T>} Task<T>
 */
/**
 * @param {Task<any> | undefined} state
 * @param {any} action
 * @returns {Task<any> | undefined}
 */
declare function TaskReducer(state: Task<any> | undefined, action: any): Task<any> | undefined;
