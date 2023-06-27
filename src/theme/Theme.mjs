/**
 * @typedef {import("./Theme").ThemeType} ThemeType
 */
import React, { useContext } from "react";

const Theme = {
  Context: React.createContext(/** @type {ThemeType | null} */ (null)),

  /**
   * @returns {ThemeType}
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
