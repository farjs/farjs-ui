/// <reference types="node" />

import { Widgets } from "@farjs/blessed";

export interface ScrollBarProps {
  readonly left: number;
  readonly top: number;
  readonly length: number;
  readonly style: Widgets.Types.TStyle;
  readonly value: number;
  readonly extent: number;
  readonly min: number;
  readonly max: number;
  onChange(value: number): void;
}
