import Color from "./Color.mjs";

/**
 * @type {import("./Theme").ThemeType}
 */
const DefaultTheme = {
  popup: {
    regular: {
      bold: false,
      bg: Color.white,
      fg: Color.black,
      focus: {
        // @ts-ignore
        bold: false,
        bg: Color.cyan,
        fg: Color.black,
      },
    },
    error: {
      bold: true,
      bg: Color.red,
      fg: Color.white,
      focus: {
        // @ts-ignore
        bold: false,
        bg: Color.white,
        fg: Color.black,
      },
    },
    menu: {
      bold: true,
      bg: Color.cyan,
      fg: Color.white,
      focus: {
        // @ts-ignore
        bold: true,
        bg: Color.black,
        fg: Color.white,
      },
    },
  },

  menu: {
    key: {
      bg: Color.black,
      fg: Color.white,
    },
    item: {
      bg: Color.cyan,
      fg: Color.black,
    },
  },

  textBox: {
    regular: {
      bold: false,
      bg: Color.cyan,
      fg: Color.black,
    },
    selected: {
      bold: false,
      bg: Color.blue,
      fg: Color.white,
    },
  },
};

export default DefaultTheme;
