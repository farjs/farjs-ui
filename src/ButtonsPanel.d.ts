import { Widgets } from "@farjs/blessed";

export interface ButtonsPanelAction {
  readonly label: string;
  onAction(): void;
}

export interface ButtonsPanelProps {
  readonly top: number;
  readonly actions: ButtonsPanelAction[];
  readonly style: Widgets.Types.TStyle;
  readonly padding?: number;
  readonly margin?: number;
}
