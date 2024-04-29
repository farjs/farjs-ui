/**
 * @typedef {import("../src/ScrollBar.mjs").ScrollBarProps} ScrollBarProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import ScrollBar from "../src/ScrollBar.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("ScrollBar.test.mjs", () => {
  it("should call onChange(min) if value = min when onClick up arrow", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, props.min);
    });
    const props = getScrollBarProps({ ...defaultProps, onChange });
    assert.deepEqual(props.value, props.min);
    const renderer = TestRenderer.create(h(ScrollBar, props));
    const text = renderer.root.findAllByType("text")[0];

    //when
    text.props.onClick(null);

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should call onChange(value-1) if value > min when onClick up arrow", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, props.value - 1);
    });
    const props = getScrollBarProps({ ...defaultProps, value: 2, onChange });
    assert.deepEqual(props.value > props.min, true);
    const renderer = TestRenderer.create(h(ScrollBar, props));
    const text = renderer.root.findAllByType("text")[0];

    //when
    text.props.onClick(null);

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should call onChange(min) if value < extent when onClick up block", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, props.min);
    });
    const props = getScrollBarProps({ ...defaultProps, value: 5, onChange });
    assert.deepEqual(props.value < props.extent, true);
    const renderer = TestRenderer.create(h(ScrollBar, props));
    const text = renderer.root.findAllByType("text")[1];

    //when
    text.props.onClick(null);

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should call onChange(value-extent) if value > extent when onClick up block", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, props.value - props.extent);
    });
    const props = getScrollBarProps({ ...defaultProps, value: 10, onChange });
    assert.deepEqual(props.value > props.extent, true);
    const renderer = TestRenderer.create(h(ScrollBar, props));
    const text = renderer.root.findAllByType("text")[1];

    //when
    text.props.onClick(null);

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should call onChange(value+extent) if value < extent when onClick down block", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, props.value + props.extent);
    });
    const props = getScrollBarProps({ ...defaultProps, value: 10, onChange });
    assert.deepEqual(props.value < props.max - props.extent, true);
    const renderer = TestRenderer.create(h(ScrollBar, props));
    const text = renderer.root.findAllByType("text")[3];

    //when
    text.props.onClick(null);

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should call onChange(max) if value > extent when onClick down block", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, props.max);
    });
    const props = getScrollBarProps({ ...defaultProps, value: 15, onChange });
    assert.deepEqual(props.value > props.max - props.extent, true);
    const renderer = TestRenderer.create(h(ScrollBar, props));
    const text = renderer.root.findAllByType("text")[3];

    //when
    text.props.onClick(null);

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should call onChange(value+1) if value < max when onClick down arrow", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, props.value + 1);
    });
    const props = getScrollBarProps({ ...defaultProps, value: 15, onChange });
    assert.deepEqual(props.value < props.max, true);
    const renderer = TestRenderer.create(h(ScrollBar, props));
    const text = renderer.root.findAllByType("text")[4];

    //when
    text.props.onClick(null);

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should call onChange(max) if value = max when onClick down arrow", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, props.max);
    });
    const props = getScrollBarProps({ ...defaultProps, value: 20, onChange });
    assert.deepEqual(props.value, props.max);
    const renderer = TestRenderer.create(h(ScrollBar, props));
    const text = renderer.root.findAllByType("text")[4];

    //when
    text.props.onClick(null);

    //then
    assert.deepEqual(onChange.times, 1);
  });

  it("should render component at min position", () => {
    //given
    const props = getScrollBarProps({ ...defaultProps });
    assert.deepEqual(props.value, props.min);

    //when
    const result = TestRenderer.create(h(ScrollBar, props)).root;

    //then
    assertScrollBar(result, props, 0);
  });

  it("should render component at min+1 position", () => {
    //given
    const props = getScrollBarProps({ ...defaultProps, value: 1 });
    assert.deepEqual(props.value, props.min + 1);

    //when
    const result = TestRenderer.create(h(ScrollBar, props)).root;

    //then
    assertScrollBar(result, props, 1);
  });

  it("should render component between min and max", () => {
    //given
    const props = getScrollBarProps({ ...defaultProps, value: 10 });
    assert.deepEqual(props.value > props.min, true);
    assert.deepEqual(props.value < props.max, true);

    //when
    const result = TestRenderer.create(h(ScrollBar, props)).root;

    //then
    assertScrollBar(result, props, 3);
  });

  it("should render component at max-1 position", () => {
    //given
    const props = getScrollBarProps({ ...defaultProps, value: 19 });
    assert.deepEqual(props.value, props.max - 1);

    //when
    const result = TestRenderer.create(h(ScrollBar, props)).root;

    //then
    assertScrollBar(result, props, 4);
  });

  it("should render component at max position", () => {
    //given
    const props = getScrollBarProps({ ...defaultProps, value: 20 });
    assert.deepEqual(props.value, props.max);

    //when
    const result = TestRenderer.create(h(ScrollBar, props)).root;

    //then
    assertScrollBar(result, props, 5);
  });
});

/**
 * @typedef {{
 *   value: number,
 *   extent: number,
 *   min: number,
 *   max: number,
 *   onChange(value: number): void
 * }} DefaultProps
 * @type {DefaultProps}
 */
const defaultProps = {
  value: 0,
  extent: 8,
  min: 0,
  max: 20,
  onChange: () => {},
};

/**
 * @param {DefaultProps} props
 * @returns {ScrollBarProps}
 */
function getScrollBarProps(props = defaultProps) {
  return {
    left: 1,
    top: 2,
    length: 8,
    style: {},
    value: props.value,
    extent: props.extent,
    min: props.min,
    max: props.max,
    onChange: props.onChange,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ScrollBarProps} props
 * @param {number} upLength
 */
function assertScrollBar(result, props, upLength) {
  assert.deepEqual(ScrollBar.displayName, "ScrollBar");

  const markerLength = 1;
  const downLength = props.length - 2 - upLength - markerLength;

  assertComponents(
    result.children,
    h("text", {
      width: 1,
      height: 1,
      left: props.left,
      top: props.top,
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: props.style,
      content: ScrollBar.upArrowCh,
    }),
    h("text", {
      width: 1,
      height: upLength,
      left: props.left,
      top: props.top + 1,
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: props.style,
      content: ScrollBar.scrollCh.repeat(upLength),
    }),
    h("text", {
      width: 1,
      height: markerLength,
      left: props.left,
      top: props.top + 1 + upLength,
      autoFocus: false,
      style: props.style,
      content: ScrollBar.markerCh,
    }),
    h("text", {
      width: 1,
      height: downLength,
      left: props.left,
      top: props.top + 1 + upLength + markerLength,
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: props.style,
      content: ScrollBar.scrollCh.repeat(downLength),
    }),
    h("text", {
      width: 1,
      height: 1,
      left: props.left,
      top: props.top + 1 + upLength + markerLength + downLength,
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: props.style,
      content: ScrollBar.downArrowCh,
    })
  );
}
