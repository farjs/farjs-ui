import { Widgets } from "@farjs/blessed";
import { MessageBoxActionType } from "./MessageBoxAction";

type BlessedStyle = Widgets.Types.TStyle;

export interface MessageBoxProps {
  readonly title: string;
  readonly message: string;
  readonly actions: MessageBoxActionType[];
  readonly style: BlessedStyle;
}
