export default ColorPanel;
declare function ColorPanel(): React.ReactElement<{
    autoFocus: boolean;
    mouse: boolean;
    tags: boolean;
    scrollbar: boolean;
    scrollable: boolean;
    alwaysScroll: boolean;
    content: string;
}, string | React.JSXElementConstructor<any>>;
declare namespace ColorPanel {
    const displayName: string;
}
import React from "react";
