/**
 * @typedef {{
 *  readonly offset: number;
 *  readonly focused: number;
 *  readonly length: number;
 *  readonly viewLength: number;
 *  updated(offset: number, focused?: number): ListViewport;
 *  down(): ListViewport;
 *  up(): ListViewport;
 *  pagedown(): ListViewport;
 *  pageup(): ListViewport;
 *  end(): ListViewport;
 *  home(): ListViewport;
 *  onKeypress(keyFull: string): ListViewport | undefined;
 *  resize(viewLength: number): ListViewport;
 * }} ListViewport
 */

/**
 * @implements {ListViewport}
 */
class ListViewportImpl {
  /**
   * @param {number} offset
   * @param {number} focused
   * @param {number} length
   * @param {number} viewLength
   */
  constructor(offset, focused, length, viewLength) {
    /** @type {number} */ this.offset = offset;
    /** @type {number} */ this.focused = focused;
    /** @type {number} */ this.length = length;
    /** @type {number} */ this.viewLength = viewLength;
  }

  /**
   * @param {number} offset
   * @param {number} [focused]
   */
  updated(offset, focused) {
    const newOffset = Math.max(
      Math.min(offset, this.length - this.viewLength),
      0
    );
    const newFocused = Math.max(
      Math.min(focused ?? this.focused, this.viewLength - 1),
      0
    );
    if (newOffset === this.offset && newFocused === this.focused) {
      return this;
    }

    return new ListViewportImpl(
      newOffset,
      newFocused,
      this.length,
      this.viewLength
    );
  }

  down() {
    const maxFocused = Math.max(
      Math.min(this.length - this.offset - 1, this.viewLength - 1),
      0
    );
    if (this.focused < maxFocused) {
      return this.updated(this.offset, this.focused + 1);
    }
    if (this.offset < this.length - this.viewLength) {
      return this.updated(this.offset + 1);
    }
    return this;
  }

  up() {
    if (this.focused > 0) return this.updated(this.offset, this.focused - 1);
    if (this.offset > 0) return this.updated(this.offset - 1);
    return this;
  }

  pagedown() {
    const newOffset = Math.max(
      Math.min(this.length - this.viewLength, this.offset + this.viewLength),
      0
    );
    const newFocused =
      newOffset === this.offset
        ? Math.max(
            Math.min(this.length - newOffset - 1, this.viewLength - 1),
            0
          )
        : Math.max(Math.min(this.length - newOffset - 1, this.focused), 0);

    return this.updated(newOffset, newFocused);
  }

  pageup() {
    const newOffset = Math.max(this.offset - this.viewLength, 0);
    const newFocused = newOffset === this.offset ? 0 : this.focused;
    return this.updated(newOffset, newFocused);
  }

  end() {
    const newOffset = Math.max(this.length - this.viewLength, 0);
    const newFocused = Math.max(
      Math.min(this.length - newOffset - 1, this.viewLength - 1),
      0
    );

    return this.updated(newOffset, newFocused);
  }

  home() {
    return this.updated(0, 0);
  }

  /**
   * @param {string} keyFull
   * @returns {ListViewport | undefined}
   */
  onKeypress(keyFull) {
    switch (keyFull) {
      case "down":
        return this.down();
      case "up":
        return this.up();
      case "pagedown":
        return this.pagedown();
      case "pageup":
        return this.pageup();
      case "end":
        return this.end();
      case "home":
        return this.home();
      default:
        return undefined;
    }
  }

  /**
   * @param {number} viewLength
   * @returns {ListViewport}
   */
  resize(viewLength) {
    const newViewLength = Math.max(viewLength, 0);
    if (newViewLength === this.viewLength) {
      return this;
    }

    const index = this.offset + this.focused;
    const dx =
      this.focused >= newViewLength ? this.focused - newViewLength + 1 : 0;

    const newOffset = Math.max(
      Math.min(this.length - newViewLength, this.offset + dx),
      0
    );
    const newFocused = Math.max(
      Math.min(this.length - newOffset - 1, index - newOffset),
      0
    );

    return new ListViewportImpl(
      newOffset,
      newFocused,
      this.length,
      newViewLength
    );
  }
}

/**
 * @param {number} index
 * @param {number} length
 * @param {number} viewLength
 * @returns {ListViewport}
 */
export function createListViewport(index, length, viewLength) {
  viewLength = Math.max(viewLength, 0);
  length = Math.max(length, 0);
  index = Math.max(Math.min(length - 1, index), 0);

  let offset = 0;
  let focused = index;
  if (index >= viewLength && viewLength > 0) {
    const rawOffset = Math.trunc(index / viewLength) * viewLength;
    offset = Math.max(Math.min(length - viewLength, rawOffset), 0);
    focused = Math.max(Math.min(length - offset - 1, index - offset), 0);
  }

  return new ListViewportImpl(offset, focused, length, viewLength);
}
