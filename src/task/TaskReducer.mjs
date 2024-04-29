/**
 * @template T
 * @typedef {import("./Task.mjs").Task<T>} Task<T>
 */

/**
 * @param {Task<any> | undefined} state
 * @param {any} action
 * @returns {Task<any> | undefined}
 */
function TaskReducer(state, action) {
  const task = action?.task;
  if (task && task.startTime && task.message && task.result) {
    return task;
  }
  return state;
}

export default TaskReducer;
