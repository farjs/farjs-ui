import React, { useState } from "react";
import * as UI from "./UI.mjs";

const h = React.createElement;

/**
 * @param {import('./Button').ButtonProps} props
 */
const Button = (props) => {
  const [focused, setFocused] = useState(false);
  const style = focused ? props.style.focus : props.style;
  const content = UI.renderText2(style, props.label);

  return h("button", {
    mouse: true,
    tags: true,
    wrap: false,
    width: props.label.length,
    height: 1,
    left: props.left,
    top: props.top,
    onPress: props.onPress,
    onFocus: () => {
      setFocused(true);
    },
    onBlur: () => {
      setFocused(false);
    },
    content: content,
  });
};

Button.displayName = "Button";

export default Button;
