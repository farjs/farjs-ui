/**
 * @typedef {import("react").ReactElement} ReactElement
 * @typedef {import("../../src/theme/Theme.mjs").Theme} Theme
 */
import React from "react";
import Theme from "../../src/theme/Theme.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";

const h = React.createElement;

/**
 * @param {ReactElement} element
 * @param {Theme} theme
 * @returns {ReactElement}
 */
const withThemeContext = (element, theme = DefaultTheme) => {
  return h(Theme.Context.Provider, { value: theme }, element);
};

export default withThemeContext;
