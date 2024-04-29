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
function TaskAction(task) {
  return {
    task,
  };
}

export default TaskAction;
