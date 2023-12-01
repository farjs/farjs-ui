import React from "react";
import PopupOverlay from "../popup/PopupOverlay.mjs";

const h = React.createElement;

const MenuBarTrigger = () => {
  return h("box", {
    height: 1,
    clickable: true,
    mouse: true,
    autoFocus: false,
    style: PopupOverlay.style,
    onClick: () => {
      process.stdin.emit("keypress", undefined, {
        name: "f9",
        ctrl: false,
        meta: false,
        shift: false,
      });
    },
  });
};

MenuBarTrigger.displayName = "MenuBarTrigger";

export default MenuBarTrigger;
