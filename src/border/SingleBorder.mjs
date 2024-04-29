import React from "react";
import HorizontalLine from "./HorizontalLine.mjs";
import VerticalLine from "./VerticalLine.mjs";
import SingleChars from "./SingleChars.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly width: number;
 *  readonly height: number;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 * }} SingleBorderProps
 */

/**
 * @param {SingleBorderProps} props
 */
const SingleBorder = (props) => {
  const { horizontalLineComp, verticalLineComp } = SingleBorder;

  return h(
    React.Fragment,
    null,
    h(horizontalLineComp, {
      left: 0,
      top: 0,
      length: props.width,
      lineCh: SingleChars.horizontal,
      style: props.style,
      startCh: SingleChars.topLeft,
      endCh: SingleChars.topRight,
    }),
    h(verticalLineComp, {
      left: 0,
      top: 1,
      length: props.height - 2,
      lineCh: SingleChars.vertical,
      style: props.style,
    }),
    h(verticalLineComp, {
      left: props.width - 1,
      top: 1,
      length: props.height - 2,
      lineCh: SingleChars.vertical,
      style: props.style,
    }),
    h(horizontalLineComp, {
      left: 0,
      top: props.height - 1,
      length: props.width,
      lineCh: SingleChars.horizontal,
      style: props.style,
      startCh: SingleChars.bottomLeft,
      endCh: SingleChars.bottomRight,
    })
  );
};

SingleBorder.displayName = "SingleBorder";
SingleBorder.horizontalLineComp = HorizontalLine;
SingleBorder.verticalLineComp = VerticalLine;

export default SingleBorder;
