import React from "react";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly length: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly value: number;
 *  readonly extent: number;
 *  readonly min: number;
 *  readonly max: number;
 *  onChange(value: number): void;
 * }} ScrollBarProps
 */

/**
 * @param {ScrollBarProps} props
 */
const ScrollBar = (props) => {
  const unitIncrement = 1;
  const blockIncrement = Math.max(props.extent, 1);
  const barLength = Math.max(props.length, 2) - 2;
  const min = Math.max(props.min, 0);
  const max = Math.max(props.max, 0);
  const value = Math.min(Math.max(props.value, min), max);
  const markerLength = 1;
  const upLength =
    value === min
      ? 0
      : value === max
      ? barLength - markerLength
      : Math.max(
          Math.min(
            Math.trunc((value * barLength) / Math.max(max - min, 1)),
            barLength - markerLength - 1
          ),
          1
        );
  const downLength = barLength - upLength - markerLength;

  return h(
    React.Fragment,
    null,
    h("text", {
      width: 1,
      height: 1,
      left: props.left,
      top: props.top,
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: props.style,
      onClick: () => {
        props.onChange(Math.max(props.value - unitIncrement, min));
      },
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
      onClick: () => {
        props.onChange(Math.max(props.value - blockIncrement, min));
      },
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
      onClick: () => {
        props.onChange(Math.min(props.value + blockIncrement, max));
      },
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
      onClick: () => {
        props.onChange(Math.min(props.value + unitIncrement, max));
      },
      content: ScrollBar.downArrowCh,
    })
  );
};

ScrollBar.displayName = "ScrollBar";

ScrollBar.markerCh = "\u2588"; // █
ScrollBar.scrollCh = "\u2591"; // ░

ScrollBar.upArrowCh = "\u25b2"; // ▲
ScrollBar.downArrowCh = "\u25bc"; // ▼

export default ScrollBar;
