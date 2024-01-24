import { Widgets } from "@farjs/blessed";
import { TextAlignType } from "./TextAlign.mjs";

type BlessedStyle = Widgets.Types.TStyle;

export interface TextLineProps {
  readonly align: TextAlignType;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly text: string;
  readonly style: BlessedStyle;
  readonly focused?: boolean;
  readonly padding?: number;
}
