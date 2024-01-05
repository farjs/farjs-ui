export interface UiString {
  strWidth(): number;
  toString(): string;
  slice(from: number, until: number): string;
  ensureWidth(width: number, padCh: string): string;
}
