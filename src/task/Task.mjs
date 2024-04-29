/**
 * @template T
 * @typedef {{
 *  readonly startTime: number;
 *  readonly message: string;
 *  readonly result: Promise<T>;
 * }} Task<T>
 */

/**
 * @template T
 * @param {string} message
 * @param {Promise<T>} result
 * @returns {Task<T>}
 */
function Task(message, result) {
  return {
    startTime: Date.now(),
    message,
    result,
  };
}

export default Task;
