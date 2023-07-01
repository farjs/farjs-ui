export interface ThemeStyle {
  readonly bold?: boolean;
  readonly bg: string;
  readonly fg: string;
}

export interface ThemeEffects extends ThemeStyle {
  readonly focus?: ThemeStyle;
}

export interface ThemePopup {
  readonly regular: ThemeEffects;
  readonly error: ThemeEffects;
  readonly menu: ThemeEffects;
}

export interface ThemeMenu {
  readonly key: ThemeStyle;
  readonly item: ThemeStyle;
}

export interface ThemeTextBox {
  readonly regular: ThemeEffects;
  readonly selected: ThemeEffects;
}

export interface ThemeType {
  readonly popup: ThemePopup;
  readonly menu: ThemeMenu;
  readonly textBox: ThemeTextBox;
}
