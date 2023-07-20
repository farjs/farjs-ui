import { Widgets } from "@farjs/blessed";

type BlessedStyle = Widgets.Types.TStyle;

export interface BlessedPadding {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
}

export interface ModalContentProps {
  readonly title: string;
  readonly width: number;
  readonly height: number;
  readonly style: BlessedStyle;
  readonly padding?: BlessedPadding;
  readonly left?: Widgets.Types.TTopLeft;
  readonly footer?: string;
}
