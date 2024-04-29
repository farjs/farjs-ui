import React from "react";
import TextAlign from "../TextAlign.mjs";
import TextLine from "../TextLine.mjs";
import HorizontalLine from "./HorizontalLine.mjs";
import VerticalLine from "./VerticalLine.mjs";
import DoubleChars from "./DoubleChars.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly width: number;
 *  readonly height: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly left?: number;
 *  readonly top?: number;
 *  readonly title?: string;
 *  readonly footer?: string;
 * }} DoubleBorderProps
 */

/**
 * @param {DoubleBorderProps} props
 */
const DoubleBorder = (props) => {
  const { horizontalLineComp, verticalLineComp, textLineComp } = DoubleBorder;
  const left = props.left ?? 0;
  const top = props.top ?? 0;

  return h(
    React.Fragment,
    null,
    h(horizontalLineComp, {
      left: left,
      top: top,
      length: props.width,
      lineCh: DoubleChars.horizontal,
      style: props.style,
      startCh: DoubleChars.topLeft,
      endCh: DoubleChars.topRight,
    }),
    props.title
      ? h(textLineComp, {
          align: TextAlign.center,
          left: left,
          top: top,
          width: props.width,
          text: props.title,
          style: props.style,
        })
      : null,
    h(verticalLineComp, {
      left: left,
      top: top + 1,
      length: props.height - 2,
      lineCh: DoubleChars.vertical,
      style: props.style,
    }),
    h(verticalLineComp, {
      left: left + props.width - 1,
      top: top + 1,
      length: props.height - 2,
      lineCh: DoubleChars.vertical,
      style: props.style,
    }),
    h(horizontalLineComp, {
      left: left,
      top: top + props.height - 1,
      length: props.width,
      lineCh: DoubleChars.horizontal,
      style: props.style,
      startCh: DoubleChars.bottomLeft,
      endCh: DoubleChars.bottomRight,
    }),
    props.footer
      ? h(textLineComp, {
          align: TextAlign.center,
          left: left,
          top: top + props.height - 1,
          width: props.width,
          text: props.footer,
          style: props.style,
        })
      : null
  );
};

DoubleBorder.displayName = "DoubleBorder";
DoubleBorder.horizontalLineComp = HorizontalLine;
DoubleBorder.verticalLineComp = VerticalLine;
DoubleBorder.textLineComp = TextLine;

export default DoubleBorder;
