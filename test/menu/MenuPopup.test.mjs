/**
 * @typedef {import("../../src/menu/MenuPopup.mjs").MenuPopupProps} MenuPopupProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import withThemeContext from "../theme/withThemeContext.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import Popup from "../../src/popup/Popup.mjs";
import ModalContent from "../../src/popup/ModalContent.mjs";
import Button from "../../src/Button.mjs";
import MenuPopup from "../../src/menu/MenuPopup.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

MenuPopup.popupComp = mockComponent(Popup);
MenuPopup.modalContentComp = mockComponent(ModalContent);
MenuPopup.buttonComp = mockComponent(Button);
const { popupComp, modalContentComp, buttonComp } = MenuPopup;

describe("MenuPopup.test.mjs", () => {
  it("should call onClose when onClose", () => {
    //given
    const onClose = mockFunction();
    const props = /** @type {MenuPopupProps} */ ({
      title: "Test title",
      items: ["item 1", "item 2"],
      getLeft: (w) => `${w}`,
      onSelect: () => {},
      onClose: onClose,
    });
    const comp = TestRenderer.create(
      withThemeContext(h(MenuPopup, props))
    ).root;
    const popup = comp.findByType(popupComp);

    //when
    popup.props.onClose();

    //then
    assert.deepEqual(onClose.times, 1);
  });

  it("should call onSelect when onPress item", () => {
    //given
    const onSelect = mockFunction((index) => {
      assert.deepEqual(index, 1);
    });
    const props = /** @type {MenuPopupProps} */ ({
      title: "Test title",
      items: ["item 1", "item 2"],
      getLeft: (w) => `${w}`,
      onSelect: onSelect,
      onClose: () => {},
    });
    const comp = TestRenderer.create(
      withThemeContext(h(MenuPopup, props))
    ).root;
    const [_, button2] = comp.findAllByType(buttonComp);

    //when
    button2.props.onPress();

    //then
    assert.deepEqual(onSelect.times, 1);
  });

  it("should render component", () => {
    //given
    const props = /** @type {MenuPopupProps} */ ({
      title: "Test title",
      items: ["item 1", "item 2"],
      getLeft: (w) => `${w}`,
      onSelect: () => {},
      onClose: () => {},
    });

    //when
    const result = TestRenderer.create(
      withThemeContext(h(MenuPopup, props))
    ).root;

    //then
    assertMenuPopup(result, props);
  });

  it("should calculate and return left pos when getLeftPos", () => {
    //when & then
    assert.deepEqual(MenuPopup.getLeftPos(10, true, 5), "0%+2");
    assert.deepEqual(MenuPopup.getLeftPos(5, true, 5), "0%+0");
    assert.deepEqual(MenuPopup.getLeftPos(5, true, 10), "0%+0");
    assert.deepEqual(MenuPopup.getLeftPos(5, false, 5), "50%+0");
    assert.deepEqual(MenuPopup.getLeftPos(10, false, 5), "50%+2");
    assert.deepEqual(MenuPopup.getLeftPos(5, false, 10), "50%-5");
    assert.deepEqual(MenuPopup.getLeftPos(5, false, 11), "0%+0");
  });
});

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {MenuPopupProps} props
 */
function assertMenuPopup(result, props) {
  assert.deepEqual(MenuPopup.displayName, "MenuPopup");

  const textWidth = props.items.reduce((_1, _2) => Math.max(_1, _2.length), 0);
  const width = textWidth + 3 * 2;
  const height = 2 * 2 + props.items.length;
  const theme = DefaultTheme.popup.menu;

  assertComponents(
    result.children,
    h(
      popupComp,
      {
        onClose: props.onClose,
        focusable: undefined,
      },
      h(
        modalContentComp,
        {
          title: props.title,
          width,
          height,
          style: theme,
          padding: MenuPopup.padding,
          left: props.getLeft(width),
          footer: undefined,
        },
        ...props.items.map((text, index) => {
          return h(buttonComp, {
            left: 1,
            top: 1 + index,
            label: text,
            style: theme,
            onPress: () => {},
          });
        })
      )
    )
  );
}
