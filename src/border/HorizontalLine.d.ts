import { Widgets } from "@farjs/blessed";

type BlessedStyle = Widgets.Types.TStyle;

export interface HorizontalLineProps {
  readonly left: number;
  readonly top: number;
  readonly length: number;
  readonly lineCh: string;
  readonly style: BlessedStyle;
  readonly startCh?: string;
  readonly endCh?: string;
}
