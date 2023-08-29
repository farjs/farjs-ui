import assert from "node:assert/strict";
import DevTool from "../../src/tool/DevTool.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const { Hidden, Logs, Inputs, Colors } = DevTool;

describe("DevTool.test.mjs", () => {
  it("should return correct value when shouldResize", () => {
    //when & then
    assert.deepEqual(DevTool.shouldResize(Hidden, Hidden), true);
    assert.deepEqual(DevTool.shouldResize(Hidden, Logs), true);
    assert.deepEqual(DevTool.shouldResize(Logs, Hidden), true);
    assert.deepEqual(DevTool.shouldResize(Colors, Hidden), true);
    assert.deepEqual(DevTool.shouldResize(Logs, Logs), false);
    assert.deepEqual(DevTool.shouldResize(Logs, Inputs), false);
    assert.deepEqual(DevTool.shouldResize(Inputs, Colors), false);
  });

  it("should transition state from Hidden to Hidden when getNext", () => {
    //given
    let state = DevTool.getNext(Hidden);
    assert.notDeepEqual(state, Hidden);

    //when
    let count = 1;
    while (state !== Hidden && count < 10) {
      count += 1;
      state = DevTool.getNext(state);
    }

    //then
    assert.deepEqual(state, Hidden);
    assert.deepEqual(count, 4);
  });
});
