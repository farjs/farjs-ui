import { DevToolValue } from "./DevTool.mjs";

export interface DevToolPanelProps {
  devTool: DevToolValue;
  logContent: string;
  onActivate(devTool: DevToolValue): void;
}
