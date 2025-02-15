/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("@farjs/blessed").Widgets.Events.IMouseEventArg} MouseEvent
 * @typedef {import("../src/ListViewport.mjs").ListViewport} ListViewport
 * @typedef {import("../src/ListView.mjs").ListViewProps} ListViewProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import DefaultTheme from "../src/theme/DefaultTheme.mjs";
import { createListViewport } from "../src/ListViewport.mjs";
import ListView from "../src/ListView.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("ListView.test.mjs", () => {
  it("should call setViewport when props.height changes", () => {
    //given
    const setViewport = mockFunction((vp) => {
      //then
      if (setViewport.times === 1) {
        assert.deepEqual(vp === props.viewport, true);
      } else {
        assertListViewport(vp, 1, 0, props.viewport.length, 1);
      }
    });
    const props = getListViewProps({ ...defaultProps, index: 1, setViewport });
    const renderer = TestRenderer.create(h(ListView, props));
    assertListView(renderer.root, props, [
      "{bold}{white-fg}{cyan-bg}  item 1            {/}",
      "{bold}{white-fg}{black-bg}  item 2            {/}",
    ]);
    const updatedProps = getListViewProps({
      ...defaultProps,
      height: 1,
      index: 1,
      setViewport,
    });

    //when
    TestRenderer.act(() => {
      renderer.update(h(ListView, updatedProps));
    });

    //then
    assert.deepEqual(setViewport.times, 2);
  });

  it("should call onClick when onClick", () => {
    //given
    const onClick = mockFunction((index) => {
      //then
      assert.deepEqual(index, 1);
    });
    const props = getListViewProps({ ...defaultProps, onClick });
    const mouseData = /** @type {MouseEvent} */ ({ y: 2 });
    const textMock = /** @type {BlessedElement} */ ({ atop: 1 });
    const renderer = TestRenderer.create(h(ListView, props), {
      createNodeMock: (el) => {
        return el.type === "text" ? textMock : null;
      },
    });
    const text = renderer.root.findByType("text");

    //when
    text.props.onClick(mouseData);

    //then
    assert.deepEqual(onClick.times, 1);
  });

  it("should not call onClick if index >= length when onClick", () => {
    //given
    const onClick = mockFunction();
    const props = getListViewProps({ ...defaultProps, onClick });
    const mouseData = /** @type {MouseEvent} */ ({ y: 3 });
    const textMock = /** @type {BlessedElement} */ ({ atop: 1 });
    const index = mouseData.y - /** @type {number} */ (textMock.atop);
    assert.deepEqual(index >= props.items.length, true);
    const renderer = TestRenderer.create(h(ListView, props), {
      createNodeMock: (el) => {
        return el.type === "text" ? textMock : null;
      },
    });
    const text = renderer.root.findByType("text");

    //when
    text.props.onClick(mouseData);

    //then
    assert.deepEqual(onClick.times, 0);
  });

  it("should call setViewport when onWheelup", () => {
    //given
    const setViewport = mockFunction((vp) => {
      //then
      if (setViewport.times === 1) {
        assert.deepEqual(vp === props.viewport, true);
      } else {
        assertListViewport(
          vp,
          props.viewport.offset,
          focused,
          props.viewport.length,
          props.viewport.viewLength
        );
      }
    });
    const props = getListViewProps({ ...defaultProps, index: 1, setViewport });
    const renderer = TestRenderer.create(h(ListView, props));
    assertListView(renderer.root, props, [
      "{bold}{white-fg}{cyan-bg}  item 1            {/}",
      "{bold}{white-fg}{black-bg}  item 2            {/}",
    ]);
    const text = renderer.root.findByType("text");
    const focused = 0;
    assert.notDeepEqual(props.viewport.focused, focused);

    //when
    text.props.onWheelup(null);

    //then
    assert.deepEqual(setViewport.times, 2);
  });

  it("should call setViewport when onWheeldown", () => {
    //given
    const setViewport = mockFunction((vp) => {
      //then
      if (setViewport.times === 1) {
        assert.deepEqual(vp === props.viewport, true);
      } else {
        assertListViewport(
          vp,
          props.viewport.offset,
          focused,
          props.viewport.length,
          props.viewport.viewLength
        );
      }
    });
    const props = getListViewProps({ ...defaultProps, setViewport });
    const renderer = TestRenderer.create(h(ListView, props));
    assertListView(renderer.root, props, [
      "{bold}{white-fg}{black-bg}  item 1            {/}",
      "{bold}{white-fg}{cyan-bg}  item 2            {/}",
    ]);
    const text = renderer.root.findByType("text");
    const focused = 1;
    assert.notDeepEqual(props.viewport.focused, focused);

    //when
    text.props.onWheeldown(null);

    //then
    assert.deepEqual(setViewport.times, 2);
  });

  it("should render component", () => {
    //given
    const props = getListViewProps({
      ...defaultProps,
      width: 10,
      items: [
        "  dir\t1 {bold}",
        "  .dir 2 looooooong",
        "  .dir \r4",
        "  .file \n5",
        "  itemй",
      ],
    });

    //when
    const result = TestRenderer.create(h(ListView, props)).root;

    //then
    assertListView(result, props, [
      "{bold}{white-fg}{black-bg}  dir 1 {open}b{/}",
      "{bold}{white-fg}{cyan-bg}  .dir 2 l{/}",
      "{bold}{white-fg}{cyan-bg}  .dir 4  {/}",
      "{bold}{white-fg}{cyan-bg}  .file 5 {/}",
      "{bold}{white-fg}{cyan-bg}  itemй   {/}",
    ]);
  });
});

/**
 * @typedef {{
 *   width: number,
 *   height: number,
 *   index: number,
 *   items: readonly string[],
 *   setViewport(viewport: ListViewport): void,
 *   onClick(index: number): void
 * }} DefaultProps
 * @type {DefaultProps}
 */
const defaultProps = {
  width: 20,
  height: 30,
  index: 0,
  items: ["  item 1", "  item 2"],
  setViewport: () => {},
  onClick: () => {},
};

/**
 * @param {DefaultProps} props
 * @returns {ListViewProps}
 */
function getListViewProps(props = defaultProps) {
  return {
    left: 1,
    top: 2,
    width: props.width,
    height: props.height,
    items: props.items,
    viewport: createListViewport(props.index, props.items.length, props.height),
    setViewport: props.setViewport,
    style: DefaultTheme.popup.menu,
    onClick: props.onClick,
  };
}

/**
 * @param {ListViewport} result
 * @param {number} offset
 * @param {number} focused
 * @param {number} length
 * @param {number} viewLength
 */
function assertListViewport(result, offset, focused, length, viewLength) {
  assert.deepEqual(result.offset, offset);
  assert.deepEqual(result.focused, focused);
  assert.deepEqual(result.length, length);
  assert.deepEqual(result.viewLength, viewLength);
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ListViewProps} props
 * @param {readonly string[]} expectedContent
 */
function assertListView(result, props, expectedContent) {
  assert.deepEqual(ListView.displayName, "ListView");

  assertComponents(
    result.children,
    h("text", {
      clickable: true,
      mouse: true,
      autoFocus: false,
      left: props.left,
      top: props.top,
      width: props.width,
      height: props.height,
      style: props.style,
      tags: true,
      wrap: false,
      content: expectedContent.join("\n"),
    })
  );
}
