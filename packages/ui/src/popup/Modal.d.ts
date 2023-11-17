import { Widgets } from "@farjs/blessed";

type BlessedStyle = Widgets.Types.TStyle;

export interface ModalProps {
  readonly title: string;
  readonly width: number;
  readonly height: number;
  readonly style: BlessedStyle;
  readonly onCancel(): void;
}
