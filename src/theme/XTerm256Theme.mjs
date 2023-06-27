import Color from "./Color.mjs";

/**
 * @type {import("./Theme").ThemeType}
 */
const XTerm256Theme = {
  popup: {
    regular: {
      bold: true,
      bg: Color.white,
      fg: "#111",
      focus: {
        // @ts-ignore
        bold: true,
        bg: "#088",
        fg: "#111",
      },
    },
    error: {
      bold: true,
      bg: Color.red,
      fg: Color.white,
      focus: {
        // @ts-ignore
        bold: true,
        bg: Color.white,
        fg: "#111",
      },
    },
    menu: {
      bold: true,
      bg: "#088",
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
      bold: true,
      bg: Color.black,
      fg: "#aaa",
    },
    item: {
      bold: true,
      bg: "#088",
      fg: "#111",
    },
  },

  textBox: {
    regular: {
      bold: true,
      bg: "#088",
      fg: "#111",
    },
    selected: {
      bold: true,
      bg: Color.blue,
      fg: Color.white,
    },
  },
};

export default XTerm256Theme;
