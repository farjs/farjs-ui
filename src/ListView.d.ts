/// <reference types="node" />

import { Widgets } from "@farjs/blessed";
import { ListViewport } from "./ListViewport";

export interface ListViewProps {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly items: string[];
  readonly viewport: ListViewport;
  setViewport(viewport: ListViewport): void;
  readonly style: Widgets.Types.TStyle;
  onClick(index: number): void;
}
