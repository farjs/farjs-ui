import React from "react";
import Theme from "../theme/Theme.mjs";
import SingleChars from "../border/SingleChars.mjs";
import DoubleChars from "../border/DoubleChars.mjs";
import DoubleBorder from "../border/DoubleBorder.mjs";
import HorizontalLine from "../border/HorizontalLine.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly selected: number;
 *  readonly items: readonly string[];
 *  readonly top: number;
 *  readonly left: number;
 *  onClick(index: number): void;
 * }} SubMenuProps
 */

/**
 * @param {SubMenuProps} props
 */
const SubMenu = (props) => {
  const { doubleBorderComp, horizontalLineComp } = SubMenu;

  const textWidth = props.items.reduce((_1, _2) => Math.max(_1, _2.length), 0);
  const width = 2 + textWidth;
  const height = 2 + props.items.length;
  const theme = Theme.useTheme().popup.menu;

  return h(
    "box",
    {
      clickable: true,
      autoFocus: false,
      width,
      height,
      top: props.top,
      left: props.left,
      shadow: true,
      style: theme,
    },
    ...[
      h(doubleBorderComp, {
        width,
        height,
        style: theme,
      }),

      props.items.map((text, index) => {
        if (text === SubMenu.separator) {
          return h(horizontalLineComp, {
            key: `${index}-sep`,
            left: 0,
            top: 1 + index,
            length: width,
            lineCh: SingleChars.horizontal,
            style: theme,
            startCh: DoubleChars.leftSingle,
            endCh: DoubleChars.rightSingle,
          });
        }

        const style = props.selected === index ? theme.focus : theme;
        return h("text", {
          key: `${index}`,
          height: 1,
          left: 1,
          top: 1 + index,
          clickable: true,
          mouse: true,
          autoFocus: false,
          style,
          onClick: () => {
            props.onClick(index);
          },
          content: text,
        });
      }),
    ]
  );
};

SubMenu.displayName = "SubMenu";
SubMenu.doubleBorderComp = DoubleBorder;
SubMenu.horizontalLineComp = HorizontalLine;
SubMenu.separator = "{SEPARATOR}";

export default SubMenu;
