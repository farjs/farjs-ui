/**
 * @typedef {import("../../src/popup/ListPopup.mjs").ListPopupProps} ListPopupProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponent, assertComponents, mockComponent } from "react-assert";
import mockFunction from "mock-fn";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import withThemeContext from "../theme/withThemeContext.mjs";
import Popup from "../../src/popup/Popup.mjs";
import ModalContent from "../../src/popup/ModalContent.mjs";
import WithSize from "../../src/WithSize.mjs";
import ListBox from "../../src/ListBox.mjs";
import ListPopup from "../../src/popup/ListPopup.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

ListPopup.popupComp = mockComponent(Popup);
ListPopup.modalContentComp = mockComponent(ModalContent);
ListPopup.withSizeComp = mockComponent(WithSize);
ListPopup.listBoxComp = mockComponent(ListBox);

const { popupComp, modalContentComp, withSizeComp, listBoxComp } = ListPopup;

describe("ListPopup.test.mjs", () => {
  it("should not call onAction if empty items when onAction", () => {
    //given
    const onAction = mockFunction();
    const props = { ...getListPopupProps(), items: [], onAction };
    const comp = TestRenderer.create(
      withThemeContext(h(ListPopup, props))
    ).root;
    const renderContent = comp.findByType(withSizeComp).props.render(60, 20);
    const resultContent = TestRenderer.create(renderContent).root;

    //when
    resultContent.findByType(listBoxComp).props.onAction(1);

    //then
    assert.deepEqual(onAction.times, 0);
  });

  it("should call onAction when onAction", () => {
    //given
    const onAction = mockFunction((index) => {
      //then
      assert.deepEqual(index, 1);
    });
    const props = { ...getListPopupProps(), onAction };
    const comp = TestRenderer.create(
      withThemeContext(h(ListPopup, props))
    ).root;
    const renderContent = comp.findByType(withSizeComp).props.render(60, 20);
    const resultContent = TestRenderer.create(renderContent).root;

    //when
    resultContent.findByType(listBoxComp).props.onAction(1);

    //then
    assert.deepEqual(onAction.times, 1);
  });

  it("should render popup with empty list", () => {
    //given
    const props = { ...getListPopupProps(), items: [] };

    //when
    const result = TestRenderer.create(
      withThemeContext(h(ListPopup, props))
    ).root;

    //then
    assertListPopup(result, props, [], [60, 20], [56, 14]);
  });

  it("should render popup with min size", () => {
    //given
    const props = { ...getListPopupProps(), items: new Array(20).fill("item") };

    //when
    const result = TestRenderer.create(
      withThemeContext(h(ListPopup, props))
    ).root;

    //then
    assertListPopup(
      result,
      props,
      new Array(20).fill("  item "),
      [55, 13],
      [56, 14]
    );
  });

  it("should render popup with max height", () => {
    //given
    const items = new Array(20).fill("item");
    const props = { ...getListPopupProps(), items, selected: items.length - 1 };

    //when
    const result = TestRenderer.create(
      withThemeContext(h(ListPopup, props))
    ).root;

    //then
    assertListPopup(
      result,
      props,
      new Array(20).fill("  item "),
      [60, 20],
      [56, 16]
    );
  });

  it("should render popup with max width", () => {
    //given
    const props = {
      ...getListPopupProps(),
      items: new Array(20).fill(
        "iteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeem"
      ),
    };

    //when
    const result = TestRenderer.create(
      withThemeContext(h(ListPopup, props))
    ).root;

    //then
    assertListPopup(
      result,
      props,
      new Array(20).fill(
        "  ite...eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeem "
      ),
      [60, 20],
      [60, 16]
    );
  });
});

/**
 * @returns {ListPopupProps}
 */
function getListPopupProps() {
  return {
    title: "Test Title",
    items: ["item 1", "item 2"],
    onAction: () => {},
    onClose: () => {},
    footer: "test footer",
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ListPopupProps} props
 * @param {string[]} items
 * @param {number[]} screenSize
 * @param {number[]} expectedSize
 */
function assertListPopup(result, props, items, screenSize, expectedSize) {
  assert.deepEqual(ListPopup.displayName, "ListPopup");

  const theme = DefaultTheme.popup.menu;
  const [width, height] = screenSize;
  const [expectedWidth, expectedHeight] = expectedSize;
  const contentWidth = expectedWidth - 2 * (ListPopup.paddingHorizontal + 1);
  const contentHeight = expectedHeight - 2 * (ListPopup.paddingVertical + 1);

  const withSizeProps = result.findByType(withSizeComp).props;
  const content = TestRenderer.create(withSizeProps.render(width, height)).root;
  assertComponent(
    content,
    h(
      modalContentComp,
      {
        title: props.title,
        width: expectedWidth,
        height: expectedHeight,
        style: theme,
        padding: ListPopup.padding,
        left: undefined,
        footer: props.footer,
      },
      h(listBoxComp, {
        left: 1,
        top: 1,
        width: contentWidth,
        height: contentHeight,
        selected: props.selected ?? 0,
        items: items,
        style: theme,
        onAction: () => {},
        onSelect: props.onSelect,
      })
    )
  );

  assertComponents(
    result.children,
    h(
      popupComp,
      {
        onClose: () => {},
        focusable: undefined,
        onKeypress: undefined,
      },
      h(withSizeComp, {
        render: mockFunction(),
      })
    )
  );
}
