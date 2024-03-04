/**
 * @typedef {import('../src/ListViewport').ListViewport} ListViewport
 * @typedef {import('../src/ComboBoxPopup').ComboBoxPopupProps} ComboBoxPopupProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import DefaultTheme from "../src/theme/DefaultTheme.mjs";
import { createListViewport } from "../src/ListViewport.mjs";
import SingleBorder from "../src/border/SingleBorder.mjs";
import ListView from "../src/ListView.mjs";
import ScrollBar from "../src/ScrollBar.mjs";
import ComboBoxPopup from "../src/ComboBoxPopup.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

ComboBoxPopup.singleBorderComp = mockComponent(SingleBorder);
ComboBoxPopup.listViewComp = mockComponent(ListView);
ComboBoxPopup.scrollBarComp = mockComponent(ScrollBar);
const { singleBorderComp, listViewComp, scrollBarComp } = ComboBoxPopup;

describe("ComboBoxPopup.test.mjs", () => {
  it("should call setViewport when box.onWheelup", () => {
    //given
    const setViewport = mockFunction((vp) => {
      assertListViewport(
        vp,
        props.viewport.offset,
        focused,
        props.viewport.length,
        props.viewport.viewLength
      );
    });
    const props = getComboBoxPopupProps({
      ...defaultProps,
      index: 1,
      setViewport,
    });
    const comp = TestRenderer.create(h(ComboBoxPopup, props)).root;
    const boxEl = comp.findByType("box");
    const focused = 0;
    assert.notDeepEqual(props.viewport.focused, focused);

    //when
    boxEl.props.onWheelup();

    //then
    assert.deepEqual(setViewport.times, 1);
  });

  it("should call setViewport when box.onWheeldown", () => {
    //given
    const setViewport = mockFunction((vp) => {
      assertListViewport(
        vp,
        props.viewport.offset,
        focused,
        props.viewport.length,
        props.viewport.viewLength
      );
    });
    const props = getComboBoxPopupProps({ ...defaultProps, setViewport });
    const comp = TestRenderer.create(h(ComboBoxPopup, props)).root;
    const boxEl = comp.findByType("box");
    const focused = 1;
    assert.notDeepEqual(props.viewport.focused, focused);

    //when
    boxEl.props.onWheeldown();

    //then
    assert.deepEqual(setViewport.times, 1);
  });

  it("should call setViewport when onChange in ScrollBar", () => {
    //given
    const setViewport = mockFunction((vp) => {
      assertListViewport(
        vp,
        offset,
        props.viewport.focused,
        props.viewport.length,
        props.viewport.viewLength
      );
    });
    const props = getComboBoxPopupProps({
      ...defaultProps,
      items: new Array(15).fill("item"),
      setViewport,
    });
    assert.deepEqual(props.items.length > ComboBoxPopup.maxItems, true);
    const comp = TestRenderer.create(h(ComboBoxPopup, props)).root;
    const scrollBar = comp.findByType(scrollBarComp);
    const offset = 1;
    assert.notDeepEqual(props.viewport.offset, offset);

    //when
    scrollBar.props.onChange(offset);

    //then
    assert.deepEqual(setViewport.times, 1);
  });

  it("should render without ScrollBar", () => {
    //given
    const props = getComboBoxPopupProps();

    //when
    const result = TestRenderer.create(h(ComboBoxPopup, props)).root;

    //then
    assertComboBoxPopup(result, props, false);
  });

  it("should render with ScrollBar", () => {
    //given
    const props = getComboBoxPopupProps({
      ...defaultProps,
      items: new Array(15).fill("item"),
    });

    //when
    const result = TestRenderer.create(h(ComboBoxPopup, props)).root;

    //then
    assertComboBoxPopup(result, props, true);
  });
});

/**
 * @typedef {{
 *   index: number,
 *   items: string[],
 *   setViewport(viewport: ListViewport): void,
 *   onClick(index: number): void
 * }} DefaultProps
 * @type {DefaultProps}
 */
const defaultProps = {
  index: 0,
  items: ["item 1", "item 2"],
  setViewport: () => {},
  onClick: () => {},
};

/**
 * @param {DefaultProps} props
 * @returns {ComboBoxPopupProps}
 */
function getComboBoxPopupProps(props = defaultProps) {
  return {
    items: props.items,
    left: 1,
    top: 2,
    width: 11,
    viewport: createListViewport(
      props.index,
      props.items.length,
      ComboBoxPopup.maxItems
    ),
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
 * @param {ComboBoxPopupProps} props
 * @param {boolean} showScrollBar
 */
function assertComboBoxPopup(result, props, showScrollBar) {
  assert.deepEqual(ComboBoxPopup.displayName, "ComboBoxPopup");

  const width = props.width;
  const height = ComboBoxPopup.maxItems + 2;
  const viewWidth = width - 2;
  const theme = props.style;

  assertComponents(
    result.children,
    h(
      "box",
      {
        clickable: true,
        autoFocus: false,
        width: width,
        height: height,
        left: props.left,
        top: props.top,
        style: theme,
      },
      ...[
        h(singleBorderComp, {
          width: width,
          height: height,
          style: theme,
        }),

        h(listViewComp, {
          left: 1,
          top: 1,
          width: viewWidth,
          height: height - 2,
          items: props.items.map(
            (i) => `  ${i.slice(0, Math.min(viewWidth - 4, i.length))}  `
          ),
          viewport: props.viewport,
          setViewport: props.setViewport,
          style: theme,
          onClick: props.onClick,
        }),

        showScrollBar
          ? h(scrollBarComp, {
              left: width - 1,
              top: 1,
              length: ComboBoxPopup.maxItems,
              style: theme,
              value: 0,
              extent: ComboBoxPopup.maxItems,
              min: 0,
              max: props.items.length - ComboBoxPopup.maxItems,
              onChange: () => {},
            })
          : null,
      ].filter((h) => h)
    )
  );
}
