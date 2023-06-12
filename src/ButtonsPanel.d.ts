import { Widgets } from "blessed";

export interface ButtonsPanelAction {
  label: string;
  onAction(): void;
}

export interface ButtonsPanelProps {
  top: number;
  actions: ButtonsPanelAction[];
  style: Widgets.Types.TStyle;
  padding?: number;
  margin?: number;
}
