import * as UI from "../src/UI.mjs";

import { strict as assert } from "node:assert";
const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

describe("UI.test.mjs", () => {
  it("should use defaults if style is undefined when renderText2", () => {
    //when
    const result = UI.renderText2(undefined, "test");

    //then
    assert.deepEqual(result, "{white-fg}{black-bg}test{/}");
  });

  it("should use defaults if style is null when renderText2", () => {
    //when
    // @ts-ignore
    const result = UI.renderText2(null, "test");

    //then
    assert.deepEqual(result, "{white-fg}{black-bg}test{/}");
  });

  it("should use style if defined when renderText2", () => {
    //given
    const style = {
      bold: true,
      fg: "yellow",
      bg: "blue",
    };

    //when
    const result = UI.renderText2(style, "test");

    //then
    assert.deepEqual(result, "{bold}{yellow-fg}{blue-bg}test{/}");
  });

  it("should return original text if empty when renderText", () => {
    //given
    const text = "";

    //when
    const result = UI.renderText(false, "yellow", "blue", text);

    //then
    assert.deepEqual(result, text);
  });

  it("should render bold text when renderText", () => {
    //given
    const isBold = true;

    //when
    const result = UI.renderText(isBold, "yellow", "blue", "test");

    //then
    assert.deepEqual(result, "{bold}{yellow-fg}{blue-bg}test{/}");
  });

  it("should render non-bold text when renderText", () => {
    //given
    const isBold = false;

    //when
    const result = UI.renderText(isBold, "yellow", "blue", "test");

    //then
    assert.deepEqual(result, "{yellow-fg}{blue-bg}test{/}");
  });

  it("should escape special chars when renderText", () => {
    //given
    const text = "start/-{}end";

    //when
    const result = UI.renderText(false, "yellow", "blue", text);

    //then
    assert.deepEqual(result, "{yellow-fg}{blue-bg}start/-{open}{close}end{/}");
  });

  it("should split text when splitText", () => {
    //when & then
    assert.deepEqual(UI.splitText("", 2), [""]);
    assert.deepEqual(UI.splitText("test", 2), ["test"]);
    assert.deepEqual(UI.splitText("test1, test2", 11), ["test1,", "test2"]);
    assert.deepEqual(UI.splitText("test1, test2", 12), ["test1, test2"]);
    assert.deepEqual(UI.splitText("test1, test2, test3", 12), [
      "test1,",
      "test2, test3",
    ]);
    assert.deepEqual(UI.splitText("test1, test2, test3", 13), [
      "test1, test2,",
      "test3",
    ]);
    assert.deepEqual(UI.splitText("test1, \n\n test2, test3", 13), [
      "test1,",
      "",
      "test2, test3",
    ]);
  });
});
