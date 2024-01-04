export interface UiString {
  readonly strWidth(): number;
  readonly toString(): string;
  readonly slice(from: number, until: number): string;
  readonly ensureWidth(width: number, padCh: string): string;
}
