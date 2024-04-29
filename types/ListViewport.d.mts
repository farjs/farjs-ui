/**
 * @param {number} index
 * @param {number} length
 * @param {number} viewLength
 * @returns {ListViewport}
 */
export function createListViewport(index: number, length: number, viewLength: number): ListViewport;
export type ListViewport = {
    readonly offset: number;
    readonly focused: number;
    readonly length: number;
    readonly viewLength: number;
    updated(offset: number, focused?: number): ListViewport;
    down(): ListViewport;
    up(): ListViewport;
    pagedown(): ListViewport;
    pageup(): ListViewport;
    end(): ListViewport;
    home(): ListViewport;
    onKeypress(keyFull: string): ListViewport | undefined;
    resize(viewLength: number): ListViewport;
};
