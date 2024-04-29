export default Theme;
export type Theme = {
    readonly popup: ThemePopup;
    readonly menu: ThemeMenu;
    readonly textBox: ThemeTextBox;
};
export type ThemeStyle = {
    readonly bold?: boolean;
    readonly bg: string;
    readonly fg: string;
};
export type ThemeEffects = ThemeStyle & {
    readonly focus?: ThemeStyle;
};
export type ThemePopup = {
    readonly regular: ThemeEffects;
    readonly error: ThemeEffects;
    readonly menu: ThemeEffects;
};
export type ThemeMenu = {
    readonly key: ThemeStyle;
    readonly item: ThemeStyle;
};
export type ThemeTextBox = {
    readonly regular: ThemeEffects;
    readonly selected: ThemeEffects;
};
declare namespace Theme {
    const Context: React.Context<Theme | null>;
    function useTheme(): Theme;
}
import React from "react";
