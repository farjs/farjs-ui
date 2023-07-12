/**
 * @typedef {import("./VerticalLine").VerticalLineProps} VerticalLineProps
 */
import React from "react";

const h = React.createElement;

/**
 * @param {VerticalLineProps} props
 */
const VerticalLine = (props) => {
  const startCh = props.startCh ?? "";
  const endCh = props.endCh ?? "";
  const line = props.lineCh.repeat(
    props.length - startCh.length - endCh.length
  );
  const content = `${startCh}${line}${endCh}`;

  return h("text", {
    width: 1,
    height: props.length,
    left: props.left,
    top: props.top,
    style: props.style,
    content,
  });
};

VerticalLine.displayName = "VerticalLine";

export default VerticalLine;
