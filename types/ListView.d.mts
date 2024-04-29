export default ListView;
export type ListViewProps = {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
    readonly items: string[];
    readonly style: BlessedStyle;
    readonly viewport: ListViewport;
    setViewport(viewport: ListViewport): void;
    onClick(index: number): void;
};
export type BlessedStyle = import("@farjs/blessed").Widgets.Types.TStyle;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type MouseEvent = import("@farjs/blessed").Widgets.Events.IMouseEventArg;
export type ListViewport = import("./ListViewport.mjs").ListViewport;
/**
 * @param {ListViewProps} props
 */
declare function ListView(props: ListViewProps): React.ReactElement<{
    ref: React.MutableRefObject<import("blessed").Widgets.BlessedElement>;
    clickable: boolean;
    mouse: boolean;
    autoFocus: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    style: import("blessed").Widgets.Types.TStyle;
    tags: boolean;
    wrap: boolean;
    content: string;
    onWheelup: () => void;
    onWheeldown: () => void;
    onClick: (data: MouseEvent) => void;
}, string | React.JSXElementConstructor<any>>;
declare namespace ListView {
    const displayName: string;
}
import React from "react";
