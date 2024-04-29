/**
 * @typedef {"Hidden" | "Logs" | "Inputs" | "Colors"} DevTool
 */

/**
 * @type {DevTool}
 */
const Hidden = "Hidden";
/**
 * @type {DevTool}
 */
const Logs = "Logs";
/**
 * @type {DevTool}
 */
const Inputs = "Inputs";
/**
 * @type {DevTool}
 */
const Colors = "Colors";

const DevTool = Object.freeze({
  Hidden,
  Logs,
  Inputs,
  Colors,

  /**
   * @param {DevTool} from
   * @param {DevTool} to
   * @returns {boolean}
   */
  shouldResize: (from, to) => {
    return from === Hidden || to === Hidden;
  },

  /**
   * @param {DevTool} from
   * @returns {DevTool}
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
