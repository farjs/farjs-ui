import { Widgets } from "@farjs/blessed";

export interface CheckBoxProps {
  readonly left: number;
  readonly top: number;
  readonly value: boolean;
  readonly label: string;
  readonly style: Widgets.Types.TStyle;
  onChange(): void;
}
