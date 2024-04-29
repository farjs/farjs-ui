import React from "react";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly percent: number;
 *  readonly left: number;
 *  readonly top: number;
 *  readonly length: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 * }} ProgressBarProps
 */

/**
 * @param {ProgressBarProps} props
 */
const ProgressBar = (props) => {
  const percent = Math.max(Math.min(props.percent, 100), 0);
  const length = Math.max(props.length, 0);
  const filledLen = Math.trunc((length * percent) / 100);
  const content =
    ProgressBar.filledCh.repeat(filledLen) +
    ProgressBar.dottedCh.repeat(length - filledLen);

  return h("text", {
    width: length,
    height: 1,
    left: props.left,
    top: props.top,
    style: props.style,
    content: content,
  });
};

ProgressBar.displayName = "ProgressBar";

ProgressBar.filledCh = "\u2588"; // █
ProgressBar.dottedCh = "\u2591"; // ░

export default ProgressBar;
