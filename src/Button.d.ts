/// <reference types="node" />

import { Widgets } from "blessed";

export interface ButtonProps {
  readonly left: number;
  readonly top: number;
  readonly label: string;
  readonly style: Widgets.Types.TStyle;
  readonly onPress(): void;
}
