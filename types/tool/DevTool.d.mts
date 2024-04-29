export default DevTool;
export type DevTool = "Hidden" | "Logs" | "Inputs" | "Colors";
declare const DevTool: Readonly<{
    Hidden: "Hidden";
    Logs: "Logs";
    Inputs: "Inputs";
    Colors: "Colors";
    /**
     * @param {DevTool} from
     * @param {DevTool} to
     * @returns {boolean}
     */
    shouldResize: (from: DevTool, to: DevTool) => boolean;
    /**
     * @param {DevTool} from
     * @returns {DevTool}
     */
    getNext: (from: DevTool) => DevTool;
}>;
