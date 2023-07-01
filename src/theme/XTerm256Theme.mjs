import Color from "./Color.mjs";

/**
 * @type {import("./Theme").ThemeType}
 */
const XTerm256Theme = Object.freeze({
  popup: Object.freeze({
    regular: Object.freeze({
      bold: true,
      bg: Color.white,
      fg: "#111",
      focus: Object.freeze({
        bold: true,
        bg: "#088",
        fg: "#111",
      }),
    }),
    error: Object.freeze({
      bold: true,
      bg: Color.red,
      fg: Color.white,
      focus: Object.freeze({
        bold: true,
        bg: Color.white,
        fg: "#111",
      }),
    }),
    menu: Object.freeze({
      bold: true,
      bg: "#088",
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
      bold: true,
      bg: Color.black,
      fg: "#aaa",
    }),
    item: Object.freeze({
      bold: true,
      bg: "#088",
      fg: "#111",
    }),
  }),

  textBox: Object.freeze({
    regular: Object.freeze({
      bold: true,
      bg: "#088",
      fg: "#111",
    }),
    selected: Object.freeze({
      bold: true,
      bg: Color.blue,
      fg: Color.white,
    }),
  }),
});

export default XTerm256Theme;
