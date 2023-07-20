/**
 * @typedef {import("./ModalContent").BlessedPadding} BlessedPadding
 * @typedef {import("./ModalContent").ModalContentProps} ModalContentProps
 */
import React from "react";
import DoubleBorder from "../border/DoubleBorder.mjs";

const h = React.createElement;

/**
 * @param {React.PropsWithChildren<ModalContentProps>} props
 */
const ModalContent = (props) => {
  const { doubleBorderComp } = ModalContent;

  const width = props.width;
  const height = props.height;
  const padding = props.padding ?? ModalContent.padding;
  const left = props.left ?? "center";

  return h(
    "box",
    {
      clickable: true,
      autoFocus: false,
      width: width,
      height: height,
      top: "center",
      left: left,
      shadow: true,
      padding: padding,
      style: props.style,
    },
    h(doubleBorderComp, {
      width: width - padding.left - padding.right,
      height: height - padding.top - padding.bottom,
      style: props.style,
      title: props.title,
      footer: props.footer,
    }),
    props.children
  );
};

ModalContent.displayName = "ModalContent";
ModalContent.doubleBorderComp = DoubleBorder;

ModalContent.paddingHorizontal = 3;
ModalContent.paddingVertical = 1;

/** @type {BlessedPadding} */
ModalContent.padding = Object.freeze({
  left: ModalContent.paddingHorizontal,
  right: ModalContent.paddingHorizontal,
  top: ModalContent.paddingVertical,
  bottom: ModalContent.paddingVertical,
});

export default ModalContent;
