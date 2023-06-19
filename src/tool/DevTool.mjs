/**
 * @typedef {"Hidden" | "Logs" | "Inputs" | "Colors"} DevToolValue
 */

/**
 * @type {DevToolValue}
 */
const Hidden = "Hidden";
/**
 * @type {DevToolValue}
 */
const Logs = "Logs";
/**
 * @type {DevToolValue}
 */
const Inputs = "Inputs";
/**
 * @type {DevToolValue}
 */
const Colors = "Colors";

const DevTool = {
  Hidden,
  Logs,
  Inputs,
  Colors,

  /**
   * @param {DevToolValue} from
   * @param {DevToolValue} to
   * @returns {boolean}
   */
  shouldResize: (from, to) => {
    return from === Hidden || to === Hidden;
  },

  /**
   * @param {DevToolValue} from
   * @returns {DevToolValue}
   */
  getNext: (from) => {
    switch (from) {
      case Hidden:
        return Logs;
      case Logs:
        return Inputs;
      case Inputs:
        return Colors;
      case Colors:
        return Hidden;
    }
  },
};

export default DevTool;
