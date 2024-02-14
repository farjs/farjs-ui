/**
 * @typedef {import('../src/ListBox').ListBoxProps} ListBoxProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import DefaultTheme from "../src/theme/DefaultTheme.mjs";
import { createListViewport } from "../src/ListViewport.mjs";
import ListView from "../src/ListView.mjs";
import ScrollBar from "../src/ScrollBar.mjs";
import ListBox from "../src/ListBox.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

ListBox.listViewComp = mockComponent(ListView);
ListBox.scrollBarComp = mockComponent(ScrollBar);
const { listViewComp, scrollBarComp } = ListBox;

describe("ListBox.test.mjs", () => {
  it("should scroll when onChange in ScrollBar", () => {
    //given
    const props = getListBoxProps({ ...defaultProps, height: 1 });
    const renderer = TestRenderer.create(h(ListBox, props));
    assertListBox(renderer.root, props, true);
    const scrollBar = renderer.root.findByType(scrollBarComp);
    const offset = 1;

    //when
    scrollBar.props.onChange(offset);

    //then
    assertListBox(renderer.root, props, true, offset);
  });

  it("should call onSelect if new index when update", () => {
    //given
    const onSelect = mockFunction((index) => {
      //then
      if (onSelect.times === 1) {
        assert.deepEqual(index, 1);
      } else {
        assert.deepEqual(index, 0);
      }
    });
    const props = getListBoxProps({ ...defaultProps, selected: 1, onSelect });
    const renderer = TestRenderer.create(h(ListBox, props));
    const listView = renderer.root.findByType(listViewComp).props;
    assert.deepEqual(listView.viewport.offset, 0);
    assert.deepEqual(listView.viewport.focused, 1);
    const viewport = listView.viewport.updated(listView.viewport.offset, 0);

    //when
    listView.setViewport(viewport);

    //then
    assert.deepEqual(onSelect.times, 2);
  });

  it("should not call onSelect if same index when update", () => {
    //given
    const onSelect = mockFunction((index) => {
      //then
      assert.deepEqual(index, 1);
    });
    const props = getListBoxProps({ ...defaultProps, selected: 1, onSelect });
    const renderer = TestRenderer.create(h(ListBox, props));
    const listView = renderer.root.findByType(listViewComp).props;
    assert.deepEqual(listView.viewport.offset, 0);
    assert.deepEqual(listView.viewport.focused, 1);
    const viewport = createListViewport(
      1,
      listView.viewport.length,
      listView.viewport.viewLength
    );

    //when
    listView.setViewport(viewport);

    //then
    assert.deepEqual(onSelect.times, 1);
  });

  it("should update viewport and call onSelect when onKeypress(down)", () => {
    //given
    const onSelect = mockFunction((index) => {
      //then
      if (onSelect.times === 1) {
        assert.deepEqual(index, 0);
      } else {
        assert.deepEqual(index, 1);
      }
    });
    const props = getListBoxProps({ ...defaultProps, onSelect });
    const renderer = TestRenderer.create(h(ListBox, props));
    assertListBox(renderer.root, props, false);
    const button = renderer.root.findByType("button");

    //when
    button.props.onKeypress(null, { full: "down" });

    //then
    assert.deepEqual(onSelect.times, 2);
    assertListBox(renderer.root, { ...props, selected: 1 }, false);
  });

  it("should call onAction when onKeypress(return)", () => {
    //given
    const onAction = mockFunction((index) => {
      //then
      assert.deepEqual(index, 1);
    });
    const props = getListBoxProps({ ...defaultProps, selected: 1, onAction });
    const renderer = TestRenderer.create(h(ListBox, props));
    const button = renderer.root.findByType("button");

    //when
    button.props.onKeypress(null, { full: "return" });

    //then
    assert.deepEqual(onAction.times, 1);
  });

  it("should render without ScrollBar", () => {
    //given
    const props = getListBoxProps({
      ...defaultProps,
      width: 10,
      items: new Array(5).fill("item"),
    });

    //when
    const result = TestRenderer.create(h(ListBox, props)).root;

    //then
    assertListBox(result, props, false);
  });

  it("should render with ScrollBar", () => {
    //given
    const props = getListBoxProps({
      ...defaultProps,
      width: 5,
      height: 20,
      items: new Array(25).fill("item"),
    });

    //when
    const result = TestRenderer.create(h(ListBox, props)).root;

    //then
    assertListBox(result, props, true);
  });
});

/**
 * @typedef {{
 *   width: number,
 *   height: number,
 *   selected: number,
 *   items: string[],
 *   onAction(index: number): void,
 *   onSelect?(index: number): void
 * }} DefaultProps
 * @type {DefaultProps}
 */
const defaultProps = {
  width: 20,
  height: 30,
  selected: 0,
  items: ["  item 1", "  item 2"],
  onAction: () => {},
};

/**
 * @param {DefaultProps} props
 * @returns {ListBoxProps}
 */
function getListBoxProps(props = defaultProps) {
  return {
    left: 1,
    top: 2,
    width: props.width,
    height: props.height,
    selected: props.selected,
    items: props.items,
    style: DefaultTheme.popup.menu,
    onAction: props.onAction,
    onSelect: props.onSelect,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ListBoxProps} props
 * @param {boolean} showScrollBar
 * @param {number} [offset]
 */
function assertListBox(result, props, showScrollBar, offset = 0) {
  assert.deepEqual(ListBox.displayName, "ListBox");

  const lv = result.findByType(listViewComp);

  assertComponents(
    result.children,
    h(
      "button",
      {
        left: props.left,
        top: props.top,
        width: props.width,
        height: props.height,
      },
      ...[
        h(listViewComp, {
          left: 0,
          top: 0,
          width: props.width,
          height: props.height,
          items: props.items,
          viewport: { ...lv.props.viewport, offset, focused: props.selected },
          setViewport: mockFunction(),
          style: props.style,
          onClick: props.onAction,
        }),
        showScrollBar
          ? h(scrollBarComp, {
              left: props.width,
              top: 0,
              length: props.height,
              style: props.style,
              value: offset,
              extent: props.height,
              min: 0,
              max: props.items.length - props.height,
              onChange: mockFunction(),
            })
          : null,
      ].filter((h) => h)
    )
  );
}
