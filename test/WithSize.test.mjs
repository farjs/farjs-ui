/**
 * @typedef {import('../src/WithSize').WithSizeProps} WithSizeProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import WithSize from "../src/WithSize.mjs";
import PopupOverlay from "../src/popup/PopupOverlay.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("WithSize.test.mjs", () => {
  it("should re-render with new size when onResize", () => {
    //given
    const props = getWithSizeProps((width, height) => {
      return h("text", null, `width: ${width}, height: ${height}`);
    });
    const boxMock = { width: 1, height: 2 };
    const comp = TestRenderer.create(h(WithSize, props), {
      createNodeMock: (el) => {
        return el.type === "box" ? boxMock : null;
      },
    }).root;
    assertWithSize(comp, 1, 2);
    boxMock.width = 2;
    boxMock.height = 3;

    //when
    TestRenderer.act(() => {
      comp.findByType("box").props.onResize();
    });

    //then
    assertWithSize(comp, 2, 3);
  });

  it("should render component with size", () => {
    //given
    const props = getWithSizeProps((width, height) => {
      return h("text", null, `width: ${width}, height: ${height}`);
    });
    const boxMock = { width: 1, height: 2 };

    //when
    const comp = TestRenderer.create(h(WithSize, props), {
      createNodeMock: (el) => {
        return el.type === "box" ? boxMock : null;
      },
    }).root;

    //then
    assert.deepEqual(WithSize.displayName, "WithSize");
    assertWithSize(comp, 1, 2);
  });
});

/**
 * @param {(width: number, height: number) => React.ReactElement | null} render
 * @returns {WithSizeProps}
 */
function getWithSizeProps(render) {
  return {
    render,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {number} width
 * @param {number} height
 */
function assertWithSize(result, width, height) {
  assertComponents(
    result.children,
    h(
      "box",
      {
        style: PopupOverlay.style,
      },
      h("text", null, `width: ${width}, height: ${height}`)
    )
  );
}
