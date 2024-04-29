import React, { useContext } from "react";

const Theme = {
  Context: React.createContext(/** @type {Theme | null} */ (null)),

  /**
   * @returns {Theme}
   */
  useTheme: () => {
    const ctx = useContext(Theme.Context);
    if (!ctx) {
      throw Error(
        "Theme.Context is not found." +
          "\nPlease, make sure you use Theme.Context.Provider in parent components"
      );
    }
    return ctx;
  },
};

export default Theme;

/**
 * @typedef {{
 *  readonly popup: ThemePopup;
 *  readonly menu: ThemeMenu;
 *  readonly textBox: ThemeTextBox;
 * }} Theme
 */

/**
 * @typedef {{
 *  readonly bold?: boolean;
 *  readonly bg: string;
 *  readonly fg: string;
 * }} ThemeStyle
 */

/**
 * @typedef {ThemeStyle & {
 *  readonly focus?: ThemeStyle;
 * }} ThemeEffects
 */

/**
 * @typedef {{
 *  readonly regular: ThemeEffects;
 *  readonly error: ThemeEffects;
 *  readonly menu: ThemeEffects;
 * }} ThemePopup
 */

/**
 * @typedef {{
 *  readonly key: ThemeStyle;
 *  readonly item: ThemeStyle;
 * }} ThemeMenu
 */

/**
 * @typedef {{
 *  readonly regular: ThemeEffects;
 *  readonly selected: ThemeEffects;
 * }} ThemeTextBox
 */
