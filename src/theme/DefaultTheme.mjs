import Color from "./Color.mjs";

/**
 * @type {import("./Theme").ThemeType}
 */
const DefaultTheme = Object.freeze({
  popup: Object.freeze({
    regular: Object.freeze({
      bold: false,
      bg: Color.white,
      fg: Color.black,
      focus: Object.freeze({
        bold: false,
        bg: Color.cyan,
        fg: Color.black,
      }),
    }),
    error: Object.freeze({
      bold: true,
      bg: Color.red,
      fg: Color.white,
      focus: Object.freeze({
        bold: false,
        bg: Color.white,
        fg: Color.black,
      }),
    }),
    menu: Object.freeze({
      bold: true,
      bg: Color.cyan,
      fg: Color.white,
      focus: Object.freeze({
        bold: true,
        bg: Color.black,
        fg: Color.white,
      }),
    }),
  }),

  menu: Object.freeze({
    key: Object.freeze({
      bg: Color.black,
      fg: Color.white,
    }),
    item: Object.freeze({
      bg: Color.cyan,
      fg: Color.black,
    }),
  }),

  textBox: Object.freeze({
    regular: Object.freeze({
      bold: false,
      bg: Color.cyan,
      fg: Color.black,
    }),
    selected: Object.freeze({
      bold: false,
      bg: Color.blue,
      fg: Color.white,
    }),
  }),
});

export default DefaultTheme;
