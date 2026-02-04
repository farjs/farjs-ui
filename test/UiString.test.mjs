/**
 * @typedef {import("../src/UiString.mjs").UiCharStartPos} UiCharStartPos
 */
import Blessed from "@farjs/blessed";
import assert from "node:assert/strict";
import UiString from "../src/UiString.mjs";

const { unicode } = Blessed;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("UiString.test.mjs", () => {
  it("should return str width when strWidth", () => {
    //when & then
    assert.deepEqual("Валютный".length, 9);
    assert.deepEqual(UiString("Валютный").strWidth(), 8);
    assert.deepEqual(UiString("\t").strWidth(), 8);
    assert.deepEqual(UiString("\u0000\u001b\r\n").strWidth(), 0);
    assert.deepEqual("\uD83C\uDF31-".length, 3);
    assert.deepEqual(UiString("\uD83C\uDF31-").strWidth(), 3);
  });

  it("should return current str when toString", () => {
    //given
    const str = "test";

    //when & then
    assert.deepEqual(UiString(str).toString(), str);
  });

  it("should return left/right char widths and start pos when charStartPos", () => {
    /**
     * @param {string} str
     * @param {number} pos
     * @param {UiCharStartPos} expected
     */
    function check(str, pos, expected) {
      assert.deepEqual(UiString(str).charStartPos(pos), expected);
    }

    //when & then
    check("", 0, { lcw: 0, pos: 0, rcw: 0 });
    check("abc", -1, { lcw: 0, pos: 0, rcw: 1 });
    check("abc", 0, { lcw: 0, pos: 0, rcw: 1 });
    check("abc", 1, { lcw: 1, pos: 1, rcw: 1 });
    check("abc", 2, { lcw: 1, pos: 2, rcw: 1 });
    check("abc", 3, { lcw: 1, pos: 3, rcw: 0 });
    check("abc", 4, { lcw: 1, pos: 3, rcw: 0 });
    check("й", 0, { lcw: 0, pos: 0, rcw: 1 });
    check("й", 1, { lcw: 1, pos: 1, rcw: 0 });
    check("й", 2, { lcw: 1, pos: 1, rcw: 0 });
    check("aй", 0, { lcw: 0, pos: 0, rcw: 1 });
    check("aй", 1, { lcw: 1, pos: 1, rcw: 1 });
    check("aй", 2, { lcw: 1, pos: 2, rcw: 0 });
    check("йa", 0, { lcw: 0, pos: 0, rcw: 1 });
    check("йa", 1, { lcw: 1, pos: 1, rcw: 1 });
    check("йa", 2, { lcw: 1, pos: 2, rcw: 0 });
    check("\uD83C\uDF31", 0, { lcw: 0, pos: 0, rcw: 2 });
    check("\uD83C\uDF31", 1, { lcw: 2, pos: 2, rcw: 0 });
    check("\uD83C\uDF31", 2, { lcw: 2, pos: 2, rcw: 0 });
    check("a\uD83C\uDF31", 0, { lcw: 0, pos: 0, rcw: 1 });
    check("a\uD83C\uDF31", 1, { lcw: 1, pos: 1, rcw: 2 });
    check("a\uD83C\uDF31", 2, { lcw: 2, pos: 3, rcw: 0 });
    check("a\uD83C\uDF31", 3, { lcw: 2, pos: 3, rcw: 0 });
    check("\uff01", 0, { lcw: 0, pos: 0, rcw: 2 });
    check("\uff01", 1, { lcw: 2, pos: 2, rcw: 0 });
    check("\uff01", 2, { lcw: 2, pos: 2, rcw: 0 });
    check("a\uff01b", 0, { lcw: 0, pos: 0, rcw: 1 });
    check("a\uff01b", 1, { lcw: 1, pos: 1, rcw: 2 });
    check("a\uff01b", 2, { lcw: 2, pos: 3, rcw: 1 });
    check("a\uff01b", 3, { lcw: 2, pos: 3, rcw: 1 });
    check("a\uff01b", 4, { lcw: 1, pos: 4, rcw: 0 });
    check("\u200D", 0, { lcw: 0, pos: 0, rcw: 0 });
    check("\u200Dй", 0, { lcw: 0, pos: 0, rcw: 1 });
    check("\u200Dй", 1, { lcw: 1, pos: 1, rcw: 0 });
    check("\u200Dй", 2, { lcw: 1, pos: 1, rcw: 0 });
    check("\u200Dй\u200Dй", 0, { lcw: 0, pos: 0, rcw: 1 });
    check("\u200Dй\u200Dй", 1, { lcw: 1, pos: 1, rcw: 1 });
    check("\u200Dй\u200Dй", 2, { lcw: 1, pos: 2, rcw: 0 });
    check("double 🉐", 4, { lcw: 1, pos: 4, rcw: 1 });
    check("double 🉐", 7, { lcw: 1, pos: 7, rcw: 2 });
    check("double 🉐", 8, { lcw: 2, pos: 9, rcw: 0 });
  });

  it("should return part of str when slice", () => {
    //given
    const str = "abcd";

    //when & then
    assert.deepEqual(UiString(str).slice(0, 4), str);
    assert.deepEqual(UiString(str).slice(-1, 5), str);
    assert.deepEqual(UiString(str).slice(0, -1), "");
    assert.deepEqual(UiString(str).slice(0, 0), "");
    assert.deepEqual(UiString(str).slice(0, 1), "a");
    assert.deepEqual(UiString(str).slice(0, 2), "ab");
    assert.deepEqual(UiString(str).slice(1, 1), "");
    assert.deepEqual(UiString(str).slice(1, 2), "b");
    assert.deepEqual(UiString(str).slice(1, 3), "bc");
    assert.deepEqual(UiString(str).slice(3, 2), "");
    assert.deepEqual(UiString(str).slice(3, 3), "");
    assert.deepEqual(UiString(str).slice(3, 4), "d");
    assert.deepEqual(UiString("").slice(0, 1), "");
  });

  it("should handle combining chars when slice", () => {
    //given
    assert.deepEqual(unicode.isCombining("\u200D", 0), true);
    assert.deepEqual(unicode.charWidth("\u200D", 0), 0);
    assert.deepEqual(unicode.isCombining("й", 0), false);
    assert.deepEqual(unicode.isCombining("й", 1), true);
    assert.deepEqual(unicode.strWidth("й"), 1);

    //when & then
    assert.deepEqual(UiString("Валютный").slice(0, 8), "Валютный");
    assert.deepEqual(UiString("Валютный").slice(6, 7), "ы");
    assert.deepEqual(UiString("Валютный").slice(7, 8), "й");
    assert.deepEqual(UiString("й").slice(0, 1), "й");
    assert.deepEqual(UiString("й\u200D").slice(0, 1), "й\u200D");
    assert.deepEqual(UiString("й\u200D\u200Db").slice(0, 1), "й\u200D\u200D");
    assert.deepEqual(UiString("й\u200D\u200Db").slice(1, 2), "b");
    assert.deepEqual(UiString("1й").slice(0, 1), "1");
    assert.deepEqual(UiString("1й").slice(0, 2), "1й");
    assert.deepEqual(UiString("й2").slice(0, 2), "й2");
    assert.deepEqual(UiString("й2").slice(0, 1), "й");
    assert.deepEqual(UiString("й2").slice(1, 2), "2");
  });

  it("should handle high/low surrogate chars when slice", () => {
    //given
    assert.deepEqual(unicode.isSurrogate("\uD83C", 0), false);
    assert.deepEqual(unicode.isSurrogate("\uD83Ca", 0), false);
    assert.deepEqual(unicode.isSurrogate("\uD83C\uDF31", 0), true);
    assert.deepEqual(unicode.isSurrogate("\uD83C\uDF31", 1), false);
    assert.deepEqual(unicode.charWidth("\uD800", 0), 0);
    assert.deepEqual(unicode.charWidth("\uD83C", 0), 0);
    assert.deepEqual(unicode.charWidth("\uDBFF", 0), 0);
    assert.deepEqual(unicode.charWidth("\uDC00", 0), 0);
    assert.deepEqual(unicode.charWidth("\uDFFF", 0), 0);
    assert.deepEqual(unicode.isCombining("\uD83C", 0), false);

    //when & then
    assert.deepEqual(UiString("\uD83C").slice(0, 1), "\uD83C");
    assert.deepEqual(UiString("a\uD83C").slice(0, 1), "a\uD83C");
    assert.deepEqual(UiString("a\uD83C\uD800b").slice(0, 1), "a\uD83C\uD800");
    assert.deepEqual(UiString("a\uD83C\uD800b").slice(1, 2), "b");
  });

  it("should handle surrogate pairs when slice", () => {
    //given
    assert.deepEqual(unicode.isSurrogate("\uD83C\uDF31", 0), true);
    assert.deepEqual(unicode.isSurrogate("\uD83C\uDF31", 1), false);
    assert.deepEqual(unicode.charWidth("\uD83C\uDF31", 0), 2);
    assert.deepEqual(unicode.charWidth("\uD83C\uDF31", 1), 0);
    assert.deepEqual(unicode.strWidth("\uD83C\uDF31"), 2);
    assert.deepEqual(unicode.strWidth("\u200D"), 0);
    assert.deepEqual(unicode.strWidth("♂️"), 1);
    assert.deepEqual(unicode.strWidth("\uD83E\uDD26\uD83C\uDFFC\u200D♂️"), 5);

    //when & then
    assert.deepEqual(UiString("\uD800\uDC002").slice(0, 2), "\uD800\uDC002");
    assert.deepEqual(UiString("\uD800\uDC002").slice(0, 1), "\uD800\uDC00");
    assert.deepEqual(UiString("\uD800\uDC002").slice(1, 2), "2");
    assert.deepEqual(UiString("\uD83C\uDF31-").slice(0, 1), "");
    assert.deepEqual(UiString("\uD83C\uDF31-").slice(0, 2), "\uD83C\uDF31");
  });

  it("should handle double-wide chars when slice", () => {
    //given
    assert.deepEqual(unicode.charWidth("\uff01", 0), 2);

    //when & then
    assert.deepEqual(UiString("te\uff012").slice(0, 5), "te\uff012");
    assert.deepEqual(UiString("te\uff012").slice(0, 4), "te\uff01");
    assert.deepEqual(UiString("te\uff012").slice(0, 3), "te");
    assert.deepEqual(UiString("te\uff012").slice(0, 2), "te");
    assert.deepEqual(UiString("te\uff012").slice(0, 1), "t");
    assert.deepEqual(UiString("te\uff012").slice(1, 2), "e");
    assert.deepEqual(UiString("te\uff012").slice(1, 3), "e");
    assert.deepEqual(UiString("te\uff012").slice(2, 3), "");
    assert.deepEqual(UiString("te\uff012").slice(2, 4), "\uff01");
    assert.deepEqual(UiString("te\uff012").slice(3, 4), "");
    assert.deepEqual(UiString("te\uff012").slice(4, 5), "2");
    assert.deepEqual(UiString("1\uff01\uff022").slice(1, 2), "");
    assert.deepEqual(UiString("1\uff01\uff022").slice(1, 3), "\uff01");
    assert.deepEqual(UiString("1\uff01\uff022").slice(1, 4), "\uff01");
    assert.deepEqual(UiString("1\uff01\uff022").slice(1, 5), "\uff01\uff02");
    assert.deepEqual(UiString("1\uff01\uff022").slice(2, 3), "");
    assert.deepEqual(UiString("1\uff01\uff022").slice(2, 4), "\uff01");
    assert.deepEqual(UiString("1\uff01\uff022").slice(2, 5), "\uff01");
    assert.deepEqual(UiString("1\uff01\uff022").slice(3, 5), "\uff02");
  });

  it("should return current str if same width when ensureWidth", () => {
    //given
    const str = "test";

    //when & then
    assert.deepEqual(UiString(str).ensureWidth(4, " "), str);
  });

  it("should pad to width if > strWidth when ensureWidth", () => {
    //when & then
    assert.deepEqual(UiString("Валютный").ensureWidth(8, " "), "Валютный");
    assert.deepEqual(UiString("Валютный").ensureWidth(9, " "), "Валютный ");
    assert.deepEqual(UiString("Валютный").ensureWidth(10, " "), "Валютный  ");
  });

  it("should cut to width if < strWidth when ensureWidth", () => {
    //when & then
    assert.deepEqual(UiString("Валютный").ensureWidth(7, " "), "Валютны");
    assert.deepEqual(UiString("Валютный").ensureWidth(8, " "), "Валютный");
    assert.deepEqual(UiString("Валютный2").ensureWidth(8, " "), "Валютный");
    assert.deepEqual(
      UiString("\uD800\uDC002").ensureWidth(1, " "),
      "\uD800\uDC00",
    );
    assert.deepEqual(UiString("\uD83C\uDF31-").ensureWidth(1, " "), " ");
    assert.deepEqual(
      UiString("\uD83C\uDF31-").ensureWidth(2, " "),
      "\uD83C\uDF31",
    );
  });

  it("should cut and pad to width if at double-width char when ensureWidth", () => {
    //given
    const str = "te\uff01t";
    assert.deepEqual(str.length, 4);
    assert.deepEqual(UiString(str).strWidth(), 5);

    //when & then
    assert.deepEqual(UiString(str).ensureWidth(6, " "), "te\uff01t ");
    assert.deepEqual(UiString(str).ensureWidth(5, " "), "te\uff01t");
    assert.deepEqual(UiString(str).ensureWidth(4, " "), "te\uff01");
    assert.deepEqual(UiString(str).ensureWidth(3, " "), "te ");
  });
});
