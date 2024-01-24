/**
 * @template T
 * @param {string} message
 * @param {Promise<T>} result
 * @returns {import('./Task').Task<T>}
 */
function Task(message, result) {
  return {
    startTime: Date.now(),
    message,
    result,
  };
}

export default Task;
