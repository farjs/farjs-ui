import { Widgets } from "@farjs/blessed";

type BlessedStyle = Widgets.Types.TStyle;

export interface SingleBorderProps {
  readonly width: number;
  readonly height: number;
  readonly style: BlessedStyle;
}
