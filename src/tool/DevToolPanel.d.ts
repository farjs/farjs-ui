import { DevToolType } from "./DevTool.mjs";

export interface DevToolPanelProps {
  devTool: DevToolType;
  logContent: string;
  onActivate(devTool: DevToolType): void;
}
