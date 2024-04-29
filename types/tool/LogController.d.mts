export default LogController;
export type LogControllerProps = {
    onReady(): void;
    render(content: string): React.ReactElement | null;
};
/**
 * @typedef {{
 *  onReady(): void;
 *  render(content: string): React.ReactElement | null;
 * }} LogControllerProps
 */
/**
 * @param {LogControllerProps} props
 */
declare function LogController(props: LogControllerProps): import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | null;
declare namespace LogController {
    const displayName: string;
    const maxBufferLength: number;
}
