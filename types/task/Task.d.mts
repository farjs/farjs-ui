export default Task;
/**
 * <T>
 */
export type Task<T> = {
    readonly startTime: number;
    readonly message: string;
    readonly result: Promise<T>;
};
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
declare function Task<T>(message: string, result: Promise<T>): Task<T>;
