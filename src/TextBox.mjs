/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("./TextInput").TextInputState} TextInputState
 * @typedef {import("./TextBox").TextBoxProps} TextBoxProps
 */
import React, { useRef, useState } from "react";
import TextInput from "./TextInput.mjs";

const h = React.createElement;

/**
 * @param {TextBoxProps} props
 */
const TextBox = (props) => {
  const { textInputComp } = TextBox;

  const inputRef = /** @type {React.MutableRefObject<BlessedElement>} */ (
    useRef()
  );
  const [state, setState] = useState(
    /** @type {TextInputState} */ (TextInput.createState())
  );

  return h(textInputComp, {
    inputRef: inputRef,
    left: props.left,
    top: props.top,
    width: props.width,
    value: props.value,
    state,
    stateUpdater: setState,
    onChange: props.onChange,
    onEnter: props.onEnter,
  });
};

TextBox.displayName = "TextBox";
TextBox.textInputComp = TextInput;

export default TextBox;
