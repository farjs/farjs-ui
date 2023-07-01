/**
 * @typedef {"Hidden" | "Logs" | "Inputs" | "Colors"} DevToolType
 */

/**
 * @type {DevToolType}
 */
const Hidden = "Hidden";
/**
 * @type {DevToolType}
 */
const Logs = "Logs";
/**
 * @type {DevToolType}
 */
const Inputs = "Inputs";
/**
 * @type {DevToolType}
 */
const Colors = "Colors";

const DevTool = Object.freeze({
  Hidden,
  Logs,
  Inputs,
  Colors,

  /**
   * @param {DevToolType} from
   * @param {DevToolType} to
   * @returns {boolean}
   */
  shouldResize: (from, to) => {
    return from === Hidden || to === Hidden;
  },

  /**
   * @param {DevToolType} from
   * @returns {DevToolType}
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
});

export default DevTool;
