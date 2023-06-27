import { Widgets } from "blessed";

type BlessedStyle = Widgets.Types.TStyle;

interface ThemePopup {
  regular: BlessedStyle;
  error: BlessedStyle;
  menu: BlessedStyle;
}

interface ThemeMenu {
  key: BlessedStyle;
  item: BlessedStyle;
}

interface ThemeTextBox {
  regular: BlessedStyle;
  selected: BlessedStyle;
}

export interface ThemeType {
  popup: ThemePopup;
  menu: ThemeMenu;
  textBox: ThemeTextBox;
}
