export default WithPortals;
export type BlessedScreen = import("@farjs/blessed").Widgets.Screen;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type PortalContext = import("./Portal.mjs").PortalContext;
export type PortalItem = {
    readonly id: number;
    readonly content: React.ReactNode;
    readonly focused: BlessedElement;
};
export type WithPortalsContext = {
    onRender(portalId: number, content: React.ReactNode): void;
    onRemove(portalId: number): void;
};
declare namespace WithPortals {
    let Context: React.Context<WithPortalsContext | null>;
    function create(screen: BlessedScreen): {
        (props: React.PropsWithChildren<{}>): React.FunctionComponentElement<{}>;
        displayName: string;
    };
}
import React from "react";
