import React from "react";
import Button from "./Button.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly label: string;
 *  onAction(): void;
 * }} ButtonsPanelAction
 */

/**
 * @typedef {{
 *  readonly top: number;
 *  readonly actions: ButtonsPanelAction[];
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  readonly padding?: number;
 *  readonly margin?: number;
 * }} ButtonsPanelProps
 */

/**
 * @param {ButtonsPanelProps} props
 */
const ButtonsPanel = (props) => {
  const { buttonComp } = ButtonsPanel;
  const padding = " ".repeat(props.padding ? props.padding : 0);
  const margin = props.margin ? props.margin : 0;

  let width = 0;
  const buttons = props.actions.map((action) => {
    const pos = width > 0 ? width + margin : 0;
    const label = `${padding}${action.label}${padding}`;
    width = pos + label.length;

    return h(buttonComp, {
      key: label,
      left: pos,
      top: 0,
      label: label,
      style: props.style,
      onPress: () => {
        Promise.resolve().then(action.onAction); //execute on the next tick
      },
    });
  });

  return h(
    "box",
    {
      width: width,
      height: 1,
      left: "center",
      top: props.top,
      style: props.style,
    },
    ...buttons
  );
};

ButtonsPanel.displayName = "ButtonsPanel";
ButtonsPanel.buttonComp = Button;

export default ButtonsPanel;
