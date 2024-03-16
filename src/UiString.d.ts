export interface UiString {
  strWidth(): number;
  toString(): string;
  charStartPos(from: number): UiCharStartPos;
  slice(from: number, until: number): string;
  ensureWidth(width: number, padCh: string): string;
}

export interface UiCharStartPos {
  readonly lcw: number;
  readonly pos: number;
  readonly rcw: number;
}
