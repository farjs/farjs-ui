export default Button;
export type ButtonProps = {
    readonly left: number;
    readonly top: number;
    readonly label: string;
    readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
    onPress(): void;
};
/**
 * @typedef {{
 *  readonly left: number;
 *  readonly top: number;
 *  readonly label: string;
 *  readonly style: import("@farjs/blessed").Widgets.Types.TStyle;
 *  onPress(): void;
 * }} ButtonProps
 */
/**
 * @param {ButtonProps} props
 */
declare function Button(props: ButtonProps): React.DetailedReactHTMLElement<{
    mouse: boolean;
    tags: boolean;
    wrap: boolean;
    width: number;
    height: number;
    left: number;
    top: number;
    onPress: () => void;
    onFocus: () => void;
    onBlur: () => void;
    content: string;
}, HTMLElement>;
declare namespace Button {
    let displayName: string;
}
import React from "react";
