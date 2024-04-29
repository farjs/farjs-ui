import Blessed from "@farjs/blessed";

const { unicode } = Blessed;

/**
 * @typedef {{
 *  readonly lcw: number;
 *  readonly pos: number;
 *  readonly rcw: number;
 * }} UiCharStartPos
 */

/**
 * @typedef {{
 *  strWidth(): number;
 *  toString(): string;
 *  charStartPos(from: number): UiCharStartPos;
 *  slice(from: number, until: number): string;
 *  ensureWidth(width: number, padCh: string): string;
 * }} UiString
 */

/**
 * @param {string} str
 * @returns {UiString}
 */
function UiString(str) {
  /** @type {number | undefined} */
  let _strWidth = undefined;

  function strWidth() {
    if (_strWidth === undefined) {
      _strWidth = unicode.strWidth(str);
    }

    return _strWidth;
  }

  /**
   * @param {number} index
   * @param {number} width
   * @returns {{i: number, sw: number, cw: number}}
   */
  function skipWidth(index, width) {
    let sw = 0;
    let cw = 0;
    let i = index;
    while (sw + cw < width && i < str.length) {
      sw += cw;
      cw = unicode.charWidth(str, i);

      if (sw + cw <= width) {
        if (unicode.isSurrogate(str, i)) {
          i += 1;
        }
        while (i + 1 < str.length && unicode.charWidth(str, i + 1) === 0) {
          i += 1;
        }
        i += 1;
      }
    }

    return { i, sw, cw };
  }

  /**
   * @param {number} width
   * @param {string} padCh
   * @returns {string}
   */
  function ensureWidth(width, padCh) {
    /**
     * @param {string} s
     * @param {number} padLen
     * @returns {string}
     */
    function pad(s, padLen) {
      const buff = [s];
      let count = padLen;
      while (count > 0) {
        buff.push(padCh);
        count -= 1;
      }
      return buff.join("");
    }

    if (width === strWidth()) {
      return str;
    }
    if (width > strWidth()) {
      return pad(str, width - strWidth());
    }

    const { i, sw, cw } = skipWidth(0, width);
    const s = str.slice(0, i);
    if (sw + cw > width) {
      return pad(s, width - sw);
    }
    return s;
  }

  return {
    strWidth,

    toString: () => str,

    charStartPos: (from) => {
      if (strWidth() === 0) {
        return { lcw: 0, pos: 0, rcw: 0 };
      }

      const pos = Math.min(Math.max(from, 0), strWidth());
      const { i, sw, cw } = skipWidth(0, pos === 0 ? 1 : pos);
      if (pos === 0) {
        return { lcw: 0, pos, rcw: cw };
      }
      const start = sw + cw;
      const next = start > pos ? i + 1 : i;
      const rcw = start === strWidth() ? 0 : skipWidth(next, 1).cw;
      return { lcw: cw, pos: start, rcw };
    },

    slice: (from, until) => {
      const start = from > 0 ? skipWidth(0, from).i : 0;
      const { i: end } = skipWidth(start, until - from);

      return start >= end ? "" : str.substring(start, end);
    },

    ensureWidth,
  };
}

export default UiString;
