import { Widgets } from "@farjs/blessed";

type BlessedStyle = Widgets.Types.TStyle;

export interface DoubleBorderProps {
  readonly width: number;
  readonly height: number;
  readonly style: BlessedStyle;
  readonly left?: number;
  readonly top?: number;
  readonly title?: string;
  readonly footer?: string;
}
