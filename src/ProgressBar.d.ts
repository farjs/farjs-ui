import { Widgets } from "@farjs/blessed";

export interface ProgressBarProps {
  readonly percent: number;
  readonly left: number;
  readonly top: number;
  readonly length: number;
  readonly style: Widgets.Types.TStyle;
}
