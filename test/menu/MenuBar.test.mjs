/**
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg} IKeyEventArg
 * @typedef {import("../../src/popup/Popup.mjs").PopupProps} PopupProps
 * @typedef {import("../../src/menu/MenuBar.mjs").MenuBarItem} MenuBarItem
 * @typedef {import("../../src/menu/MenuBar.mjs").MenuBarProps} MenuBarProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponent, assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import withThemeContext from "../theme/withThemeContext.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import Popup from "../../src/popup/Popup.mjs";
import ButtonsPanel from "../../src/ButtonsPanel.mjs";
import SubMenu from "../../src/menu/SubMenu.mjs";
import MenuBar from "../../src/menu/MenuBar.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

MenuBar.popupComp = mockComponent(Popup);
MenuBar.buttonsPanel = mockComponent(ButtonsPanel);
MenuBar.subMenuComp = mockComponent(SubMenu);
const { popupComp, buttonsPanel, subMenuComp } = MenuBar;

/** @type {readonly MenuBarItem[]} */
const items = [
  {
    label: "Menu 1",
    subItems: ["Item 1", SubMenu.separator, "Item 2", "Item 3"],
  },
  {
    label: "Menu 2",
    subItems: ["Item 4", "Item 5"],
  },
  {
    label: "Menu 3",
    subItems: ["Item 6"],
  },
];

describe("MenuBar.test.mjs", () => {
  it("should call onClose when onKeypress(F10)", () => {
    //given
    const onClose = mockFunction();
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose,
    });
    const comp = TestRenderer.create(withThemeContext(h(MenuBar, props))).root;
    const popupProps = comp.findByType(popupComp).props;

    //when
    assert.deepEqual(popupProps.onKeypress("f10"), true);

    //then
    assert.deepEqual(onClose.times, 1);
  });

  it("should hide sub-menu when onKeypress(escape)", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const buttonsProps = renderer.root.findByType(buttonsPanel).props;
    buttonsProps.actions[0].onAction();
    assert.deepEqual(renderer.root.findAllByType(subMenuComp).length, 1);
    const onKeypress = findOnKeypress(renderer);

    //when
    assert.deepEqual(onKeypress("escape"), true);

    //then
    assert.deepEqual(renderer.root.findAllByType(subMenuComp).length, 0);
  });

  it("should return false if no sub-menu when onKeypress(escape)", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const onKeypress = findOnKeypress(renderer);
    assert.deepEqual(renderer.root.findAllByType(subMenuComp).length, 0);

    //when & then
    assert.deepEqual(onKeypress("escape"), false);
  });

  it("should select sub-menu items when onKeypress(down/up)", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const buttonsProps = renderer.root.findByType(buttonsPanel).props;
    buttonsProps.actions[0].onAction();
    assertComponent(
      renderer.root.findByType(subMenuComp),
      h(subMenuComp, {
        selected: 0,
        items: ["Item 1", SubMenu.separator, "Item 2", "Item 3"],
        top: 1,
        left: 2,
        onClick: () => {},
      })
    );

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("up"), true);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.selected, 3);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("down"), true);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.selected, 0);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("down"), true);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.selected, 2);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("down"), true);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.selected, 3);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("up"), true);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.selected, 2);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("up"), true);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.selected, 0);
  });

  it("should emit keypress(enter) if no sub-menu when onKeypress(down)", () => {
    //given
    const onKey = mockFunction((name, ctrl, meta, shift) => {
      assert.deepEqual(name, "enter");
      assert.deepEqual(ctrl, false);
      assert.deepEqual(meta, false);
      assert.deepEqual(shift, false);
    });
    /** @type {(ch: object, key: IKeyEventArg) => void} */
    const listener = (_, key) => {
      //cleanup
      process.stdin.removeListener("keypress", listener);

      //then
      onKey(key.name, key.ctrl, key.meta, key.shift);
    };
    process.stdin.on("keypress", listener);

    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const onKeypress = findOnKeypress(renderer);

    //when
    assert.deepEqual(onKeypress("down"), true);

    //then
    assert.deepEqual(onKey.times, 1);
  });

  it("should return true if no sub-menu when onKeypress(up)", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const onKeypress = findOnKeypress(renderer);

    //when & then
    assert.deepEqual(onKeypress("up"), true);
  });

  it("should show next/prev sub-menu when onKeypress(right/left)", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const buttonsProps = renderer.root.findByType(buttonsPanel).props;
    buttonsProps.actions[0].onAction();
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.left, 2);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("left"), false);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.left, 22);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("right"), false);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.left, 2);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("right"), false);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.left, 12);

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("left"), false);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.left, 2);
  });

  it("should return false if no sub-menu when onKeypress(space)", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("space"), false);
  });

  it("should return false when onKeypress(other)", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));

    //when & then
    assert.deepEqual(findOnKeypress(renderer)("other"), false);
  });

  it("should call onAction when onKeypress(enter)", async () => {
    //given
    const onAction = mockFunction((menuIndex, subIndex) => {
      assert.deepEqual(menuIndex, 0);
      assert.deepEqual(subIndex, 2);
    });
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction,
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const buttonsProps = renderer.root.findByType(buttonsPanel).props;
    buttonsProps.actions[0].onAction();
    assert.deepEqual(findOnKeypress(renderer)("down"), true);
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.selected, 2);

    //when
    assert.deepEqual(findOnKeypress(renderer)("enter"), true);

    //then
    await Promise.resolve().then(() => {
      assert.deepEqual(onAction.times, 1);
    });
  });

  it("should call onAction when onClick", async () => {
    //given
    const onAction = mockFunction((menuIndex, subIndex) => {
      assert.deepEqual(menuIndex, 0);
      assert.deepEqual(subIndex, 2);
    });
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction,
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const buttonsProps = renderer.root.findByType(buttonsPanel).props;
    buttonsProps.actions[0].onAction();
    assert.deepEqual(renderer.root.findByType(subMenuComp).props.selected, 0);

    //when
    renderer.root.findByType(subMenuComp).props.onClick(2);

    //then
    await Promise.resolve().then(() => {
      assert.deepEqual(onAction.times, 1);
    });
  });

  it("should render sub-menu", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });
    const renderer = TestRenderer.create(withThemeContext(h(MenuBar, props)));
    const buttonsProps = renderer.root.findByType(buttonsPanel).props;

    //when
    buttonsProps.actions[0].onAction();

    //then
    assertComponent(
      renderer.root.findByType(subMenuComp),
      h(subMenuComp, {
        selected: 0,
        items: ["Item 1", SubMenu.separator, "Item 2", "Item 3"],
        top: 1,
        left: 2,
        onClick: () => {},
      })
    );
  });

  it("should render main menu", () => {
    //given
    const props = /** @type {MenuBarProps} */ ({
      items,
      onAction: () => {},
      onClose: () => {},
    });

    //when
    const result = TestRenderer.create(
      withThemeContext(h(MenuBar, props))
    ).root;

    //then
    assertMenuBar(result);
  });
});

/**
 * @param {TestRenderer.ReactTestRenderer} renderer
 * @returns {(keyFull: string) => boolean}
 */
function findOnKeypress(renderer) {
  return renderer.root.findByType(popupComp).props.onKeypress;
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 */
function assertMenuBar(result) {
  assert.deepEqual(MenuBar.displayName, "MenuBar");
  const theme = DefaultTheme.popup.menu;

  assertComponents(
    result.children,
    h(
      popupComp,
      {
        onClose: () => {},
        focusable: undefined,
      },
      h(
        "box",
        {
          height: 1,
          style: theme,
        },
        h(
          "box",
          {
            width: 30,
            height: 1,
            left: 2,
          },
          h(buttonsPanel, {
            top: 0,
            actions: [
              { label: "Menu 1", onAction: () => {} },
              { label: "Menu 2", onAction: () => {} },
              { label: "Menu 3", onAction: () => {} },
            ],
            style: theme,
            padding: 2,
            margin: undefined,
          })
        )
      )
    )
  );
}
