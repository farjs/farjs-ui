/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("./WithSize").WithSizeProps} WithSizeProps
 */
import React, { useLayoutEffect, useRef, useState } from "react";
import PopupOverlay from "./popup/PopupOverlay.mjs";

const h = React.createElement;

/**
 * @param {WithSizeProps} props
 */
const WithSize = (props) => {
  const boxRef = /** @type {React.MutableRefObject<BlessedElement>} */ (
    useRef()
  );
  const [size, setSize] = useState([0, 0]);
  const [width, height] = size;

  useLayoutEffect(() => {
    const currBox = boxRef.current;
    setSize([
      /** @type {number} */ (currBox.width),
      /** @type {number} */ (currBox.height),
    ]);
    return undefined;
  }, size);

  return h(
    "box",
    {
      ref: boxRef,
      style: PopupOverlay.style,
      onResize: () => {
        const currBox = boxRef.current;
        setSize([
          /** @type {number} */ (currBox.width),
          /** @type {number} */ (currBox.height),
        ]);
      },
    },
    props.render(width, height)
  );
};

WithSize.displayName = "WithSize";

export default WithSize;
