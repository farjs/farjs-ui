import { Widgets } from "@farjs/blessed";

export interface ListBoxProps {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly style: Widgets.Types.TStyle;
  readonly items: string[];
  readonly selected: number;
  onAction(index: number): void;
  onSelect?(index: number): void;
}
