/**
 * @typedef {import("../src/ListViewport").ListViewport} ListViewport
 */
import assert from "node:assert/strict";
import { createListViewport } from "../src/ListViewport.mjs";

const viewLength = 8;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("ListViewport.test.mjs", () => {
  it("should return undefined when onKeypress(unknown)", () => {
    //given
    const viewport = createListViewport(0, 5, viewLength);

    //when & then
    assert.deepEqual(viewport.onKeypress("unknown"), undefined);
  });

  it("should return same instance if length = 0 when onKeypress", () => {
    //given
    const viewport = createListViewport(0, 0, viewLength);

    /** @param {string} keyFull */
    function check(keyFull) {
      assert.equal(viewport.onKeypress(keyFull), viewport);
    }

    //when & then
    check("up");
    check("down");
    check("pageup");
    check("pagedown");
    check("home");
    check("end");
  });

  it("should return same instance if length = 1 when onKeypress", () => {
    //given
    const viewport = createListViewport(0, 1, viewLength);

    /** @param {string} keyFull */
    function check(keyFull) {
      assert.equal(viewport.onKeypress(keyFull), viewport);
    }

    //when & then
    check("up");
    check("down");
    check("pageup");
    check("pagedown");
    check("home");
    check("end");
  });

  it("should return updated instance if length < viewLength when onKeypress", () => {
    //given
    let viewport = createListViewport(0, 5, viewLength);
    assert.equal(viewport.length < viewport.viewLength, true);

    /**
     * @param {string} keyFull
     * @param {number} focused
     */
    function check(keyFull, focused) {
      const result = viewport.onKeypress(keyFull);
      if (result === undefined) {
        assert.fail("result is undefined");
      }
      assert.deepEqual(result, viewport.updated(viewport.offset, focused));
      viewport = result;
    }

    //when & then
    check("up", 0);
    check("pageup", 0);
    check("home", 0);
    check("down", 1);
    check("down", 2);
    check("pagedown", 4);
    check("pageup", 0);
    check("end", 4);
    check("down", 4);
    check("pagedown", 4);
    check("up", 3);
    check("up", 2);
    check("home", 0);
  });

  it("should return updated instance if length > viewLength when onKeypress", () => {
    //given
    let viewport = createListViewport(0, 10, viewLength);
    assert.equal(viewport.length > viewport.viewLength, true);

    /**
     * @param {string} keyFull
     * @param {number} offset
     * @param {number} focused
     */
    function check(keyFull, offset, focused) {
      const result = viewport.onKeypress(keyFull);
      if (result === undefined) {
        assert.fail("result is undefined");
      }
      assert.deepEqual(result, viewport.updated(offset, focused));
      viewport = result;
    }

    //when & then
    check("up", 0, 0);
    check("pageup", 0, 0);
    check("home", 0, 0);
    check("down", 0, 1);
    check("down", 0, 2);
    check("pagedown", 2, 2);
    check("pagedown", 2, 7);
    check("pageup", 0, 7);
    check("pageup", 0, 0);
    check("down", 0, 1);
    check("down", 0, 2);
    check("down", 0, 3);
    check("down", 0, 4);
    check("down", 0, 5);
    check("down", 0, 6);
    check("down", 0, 7);
    check("down", 1, 7);
    check("down", 2, 7);
    check("down", 2, 7);
    check("end", 2, 7);
    check("pagedown", 2, 7);
    check("up", 2, 6);
    check("up", 2, 5);
    check("up", 2, 4);
    check("up", 2, 3);
    check("up", 2, 2);
    check("up", 2, 1);
    check("up", 2, 0);
    check("up", 1, 0);
    check("up", 0, 0);
    check("up", 0, 0);
    check("end", 2, 7);
    check("home", 0, 0);
  });

  it("should return same instance if newViewLength = viewLength when resize", () => {
    //given
    const viewport = createListViewport(0, 0, viewLength);

    //when & then
    assert.equal(viewport.resize(viewport.viewLength), viewport);
  });

  it("should return updated instance when resize", () => {
    //given
    let viewport = createListViewport(9, 10, 8);

    /**
     * @param {number} offset
     * @param {number} focused
     * @param {number} viewLength
     */
    function check(offset, focused, viewLength) {
      const result = viewport.resize(viewLength);
      assert.deepEqual(
        { ...result },
        { ...viewport, offset, focused, viewLength }
      );
      viewport = result;
    }

    //when & then
    check(1, 8, 9);
    check(0, 9, 10);
    check(0, 9, 11);
    check(0, 9, 10);
    check(1, 8, 9);
    check(2, 7, 8);
    check(3, 6, 7);
    check(4, 5, 6);
    check(5, 4, 5);
    check(6, 3, 4);
    check(7, 2, 3);
    check(8, 1, 2);
    check(9, 0, 1);
    check(8, 1, 2);
    check(7, 2, 3);
  });

  it("should return new instance with normalized offset and focused when create", () => {
    /**
     * @param {ListViewport} result
     * @param {number} offset
     * @param {number} focused
     */
    function check(result, offset, focused) {
      assert.deepEqual({ ...result }, { ...result, offset, focused });
    }

    //when & then
    check(createListViewport(9, 10, 0), 0, 9);
    check(createListViewport(0, 10, 8), 0, 0);
    check(createListViewport(1, 10, 8), 0, 1);
    check(createListViewport(2, 10, 8), 0, 2);
    check(createListViewport(7, 10, 8), 0, 7);
    check(createListViewport(8, 10, 8), 2, 6);
    check(createListViewport(9, 10, 8), 2, 7);
    check(createListViewport(0, 20, 8), 0, 0);
    check(createListViewport(1, 20, 8), 0, 1);
    check(createListViewport(7, 20, 8), 0, 7);
    check(createListViewport(8, 20, 8), 8, 0);
    check(createListViewport(9, 20, 8), 8, 1);
    check(createListViewport(10, 20, 8), 8, 2);
    check(createListViewport(11, 20, 8), 8, 3);
    check(createListViewport(15, 20, 8), 8, 7);
    check(createListViewport(16, 20, 8), 12, 4);
    check(createListViewport(17, 20, 8), 12, 5);
    check(createListViewport(19, 20, 8), 12, 7);
  });
});
