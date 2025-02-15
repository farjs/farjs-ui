/**
 * @typedef {import("./ListViewport.mjs").ListViewport} ListViewport
 */
import React from "react";
import SingleBorder from "./border/SingleBorder.mjs";
import ListView from "./ListView.mjs";
import ScrollBar from "./ScrollBar.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly width: number;
 *  readonly items: readonly string[];
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly viewport: ListViewport;
 *  setViewport(viewport: ListViewport): void;
 *  onClick(index: number): void;
 * }} ComboBoxPopupProps
 */

/**
 * @param {ComboBoxPopupProps} props
 */
const ComboBoxPopup = (props) => {
  const { singleBorderComp, listViewComp, scrollBarComp } = ComboBoxPopup;

  const width = props.width;
  const height = ComboBoxPopup.maxItems + 2;
  const viewWidth = width - 2;
  const theme = props.style;
  const viewport = props.viewport;

  return h(
    "box",
    {
      clickable: true,
      autoFocus: false,
      width: width,
      height: height,
      left: props.left,
      top: props.top,
      onWheelup: () => {
        props.setViewport(viewport.up());
      },
      onWheeldown: () => {
        props.setViewport(viewport.down());
      },
      style: theme,
    },

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
      viewport: viewport,
      setViewport: props.setViewport,
      style: theme,
      onClick: props.onClick,
    }),

    viewport.length > viewport.viewLength
      ? h(scrollBarComp, {
          left: width - 1,
          top: 1,
          length: viewport.viewLength,
          style: theme,
          value: viewport.offset,
          extent: viewport.viewLength,
          min: 0,
          max: viewport.length - viewport.viewLength,
          onChange: (offset) => {
            props.setViewport(viewport.updated(offset));
          },
        })
      : null
  );
};

ComboBoxPopup.displayName = "ComboBoxPopup";
ComboBoxPopup.singleBorderComp = SingleBorder;
ComboBoxPopup.listViewComp = ListView;
ComboBoxPopup.scrollBarComp = ScrollBar;

ComboBoxPopup.maxItems = 8;

export default ComboBoxPopup;
