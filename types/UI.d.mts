/**
 * @param {import("@farjs/blessed").Widgets.Types.TStyle | undefined} style
 * @param {string} text
 * @returns {string}
 */
export function renderText2(style: import("@farjs/blessed").Widgets.Types.TStyle | undefined, text: string): string;
/**
 * @param {boolean} isBold
 * @param {string} fgColor
 * @param {string} bgColor
 * @param {string} text
 * @returns {string}
 */
export function renderText(isBold: boolean, fgColor: string, bgColor: string, text: string): string;
/**
 * @param {string} text
 * @param {number} maxLen
 * @returns {string[]}
 */
export function splitText(text: string, maxLen: number): string[];
