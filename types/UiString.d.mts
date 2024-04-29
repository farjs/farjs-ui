export default UiString;
export type UiCharStartPos = {
    readonly lcw: number;
    readonly pos: number;
    readonly rcw: number;
};
export type UiString = {
    strWidth(): number;
    toString(): string;
    charStartPos(from: number): UiCharStartPos;
    slice(from: number, until: number): string;
    ensureWidth(width: number, padCh: string): string;
};
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
declare function UiString(str: string): UiString;
