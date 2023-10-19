/**
 * @template T
 * @param {import('./Task').Task<T> | undefined} state
 * @param {any} action
 * @returns {import('./Task').Task<T> | undefined}
 */
function TaskReducer(state, action) {
  const task = action?.task;
  if (task && task.startTime && task.message && task.result) {
    return task;
  }
  return state;
}

export default TaskReducer;
