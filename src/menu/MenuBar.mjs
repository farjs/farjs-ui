/**
 * @typedef {import("../../src/ButtonsPanel.mjs").ButtonsPanelAction} ButtonsPanelAction
 */
import React, { useState } from "react";
import Theme from "../theme/Theme.mjs";
import Popup from "../popup/Popup.mjs";
import ButtonsPanel from "../ButtonsPanel.mjs";
import SubMenu from "./SubMenu.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly label: string;
 *  readonly subItems: string[];
 * }} MenuBarItem
 */

/**
 * @typedef {{
 *  readonly items: MenuBarItem[];
 *  onAction(menuIndex: number, subIndex: number): void;
 *  onClose(): void;
 * }} MenuBarProps
 */

/**
 * @typedef {{
 *  readonly menuIndex: number;
 *  readonly subIndex: number;
 * }} SubMenuState
 */

/**
 * @param {MenuBarProps} props
 */
const MenuBar = (props) => {
  const { popupComp, buttonsPanel, subMenuComp } = MenuBar;

  /** @type {[SubMenuState | undefined, React.Dispatch<React.SetStateAction<SubMenuState | undefined>>]} */
  const [maybeSubMenu, setSubMenu] = useState();
  const theme = Theme.useTheme().popup.menu;
  const marginLeft = 2;
  const padding = 2;
  const width = props.items.reduce((res, item) => {
    return res + item.label.length + padding * 2;
  }, 0);
  /** @type {ButtonsPanelAction[]} */
  const actions = props.items.map((item, index) => {
    return {
      label: item.label,
      onAction: () => setSubMenu({ menuIndex: index, subIndex: 0 }),
    };
  });

  /** @type {(menuIndex: number) => number} */
  const getLeftPos = (menuIndex) => {
    let leftPos = marginLeft;
    for (let i = 0; i < menuIndex; i++) {
      leftPos += actions[i].label.length + padding * 2;
    }
    return leftPos;
  };

  /** @type {(menuIndex: number, subIndex: number) => void} */
  const onAction = (menuIndex, subIndex) => {
    //execute on the next tick
    Promise.resolve().then(() => props.onAction(menuIndex, subIndex));
  };

  /** @type {(keyFull: string) => boolean} */
  const onKeypress = (keyFull) => {
    let processed = true;
    switch (keyFull) {
      case "f10":
        props.onClose();
        break;
      case "escape":
        if (maybeSubMenu) setSubMenu(undefined);
        else processed = false;
        break;
      case "down":
        if (maybeSubMenu) {
          const { menuIndex, subIndex } = maybeSubMenu;
          const subItems = props.items[menuIndex].subItems;
          const newSubIndex =
            subIndex === subItems.length - 1
              ? 0
              : subItems[subIndex + 1] === SubMenu.separator
              ? subIndex + 2
              : subIndex + 1;
          setSubMenu({ menuIndex, subIndex: newSubIndex });
        } else {
          process.stdin.emit("keypress", undefined, {
            name: "enter",
            ctrl: false,
            meta: false,
            shift: false,
          });
        }
        break;
      case "up":
        if (maybeSubMenu) {
          const { menuIndex, subIndex } = maybeSubMenu;
          const subItems = props.items[menuIndex].subItems;
          const newSubIndex =
            subIndex === 0
              ? subItems.length - 1
              : subItems[subIndex - 1] === SubMenu.separator
              ? subIndex - 2
              : subIndex - 1;
          setSubMenu({ menuIndex, subIndex: newSubIndex });
        }
        break;
      case "right":
      case "tab":
        processed = false;
        if (maybeSubMenu) {
          const { menuIndex } = maybeSubMenu;
          const newIndex = menuIndex === actions.length - 1 ? 0 : menuIndex + 1;
          setSubMenu({ menuIndex: newIndex, subIndex: 0 });
        }
        break;
      case "left":
      case "S-tab":
        processed = false;
        if (maybeSubMenu) {
          const { menuIndex } = maybeSubMenu;
          const newIndex = menuIndex === 0 ? actions.length - 1 : menuIndex - 1;
          setSubMenu({ menuIndex: newIndex, subIndex: 0 });
        }
        break;
      case "enter":
      case "space":
        if (maybeSubMenu) {
          const { menuIndex, subIndex } = maybeSubMenu;
          onAction(menuIndex, subIndex);
        } else {
          processed = false;
        }
        break;
      default:
        processed = false;
        break;
    }
    return processed;
  };

  function renderSubMenu() {
    if (maybeSubMenu) {
      const { menuIndex, subIndex } = maybeSubMenu;
      return h(subMenuComp, {
        selected: subIndex,
        items: props.items[menuIndex].subItems,
        top: 1,
        left: getLeftPos(menuIndex),
        onClick: (index) => {
          onAction(menuIndex, index);
        },
      });
    }
    return null;
  }

  return h(
    React.Fragment,
    null,
    h(
      popupComp,
      {
        onClose: props.onClose,
        onKeypress,
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
            width: width,
            height: 1,
            left: marginLeft,
          },
          h(buttonsPanel, {
            top: 0,
            actions: actions,
            style: theme,
            padding: padding,
          })
        )
      )
    ),
    renderSubMenu()
  );
};

MenuBar.displayName = "MenuBar";
MenuBar.popupComp = Popup;
MenuBar.buttonsPanel = ButtonsPanel;
MenuBar.subMenuComp = SubMenu;

export default MenuBar;
