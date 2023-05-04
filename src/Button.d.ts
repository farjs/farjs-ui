/// <reference types="node" />

import { Widgets } from "blessed";

export interface ButtonProps {
  left: number;
  top: number;
  label: string;
  style: Widgets.Types.TStyle;
  onPress(): void;
}
