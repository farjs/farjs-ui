/**
 * @typedef {import("./HorizontalLine").HorizontalLineProps} HorizontalLineProps
 */
import React from "react";

const h = React.createElement;

/**
 * @param {HorizontalLineProps} props
 */
const HorizontalLine = (props) => {
  const startCh = props.startCh ?? "";
  const endCh = props.endCh ?? "";
  const line = props.lineCh.repeat(
    props.length - startCh.length - endCh.length
  );
  const content = `${startCh}${line}${endCh}`;

  return h("text", {
    width: props.length,
    height: 1,
    left: props.left,
    top: props.top,
    style: props.style,
    content,
  });
};

HorizontalLine.displayName = "HorizontalLine";

export default HorizontalLine;
