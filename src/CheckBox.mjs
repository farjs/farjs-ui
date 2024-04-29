import React from "react";
import Button from "./Button.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly value: boolean;
 *  readonly label: string;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  onChange(): void;
 * }} CheckBoxProps
 */

/**
 * @param {CheckBoxProps} props
 */
const CheckBox = (props) => {
  const { buttonComp } = CheckBox;

  return h(
    React.Fragment,
    null,
    h(buttonComp, {
      left: props.left,
      top: props.top,
      label: props.value ? "[x]" : "[ ]",
      style: props.style,
      onPress: props.onChange,
    }),
    h("text", {
      height: 1,
      left: props.left + 4,
      top: props.top,
      style: props.style,
      content: props.label,
    })
  );
};

CheckBox.displayName = "CheckBox";
CheckBox.buttonComp = Button;

export default CheckBox;
