/**
 * @typedef {import("./BottomMenu").BottomMenuProps} BottomMenuProps
 */
import React from "react";
import WithSize from "../WithSize.mjs";
import BottomMenuView from "./BottomMenuView.mjs";

const h = React.createElement;

/**
 * @param {BottomMenuProps} props
 */
const BottomMenu = (props) => {
  const { withSizeComp, bottomMenuViewComp } = BottomMenu;

  return h(withSizeComp, {
    render: (width) => {
      return h(bottomMenuViewComp, {
        width: width,
        items: props.items,
      });
    },
  });
};

BottomMenu.displayName = "BottomMenu";
BottomMenu.withSizeComp = WithSize;
BottomMenu.bottomMenuViewComp = BottomMenuView;

export default BottomMenu;
