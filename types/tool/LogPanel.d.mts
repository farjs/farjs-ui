export default LogPanel;
export type LogPanelProps = {
    readonly content: string;
};
/**
 * @param {LogPanelProps} props
 */
declare function LogPanel(props: LogPanelProps): React.ReactElement<{
    autoFocus: boolean;
    mouse: boolean;
    style: import("blessed").Widgets.Types.TStyle;
    scrollbar: boolean;
    scrollable: boolean;
    alwaysScroll: boolean;
    content: string;
}, string | React.JSXElementConstructor<any>>;
declare namespace LogPanel {
    const displayName: string;
}
import React from "react";
