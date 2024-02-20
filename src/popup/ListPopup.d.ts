export interface ListPopupProps {
  readonly title: string;
  readonly items: string[];
  onAction(index: number): void;
  onClose(): void;
  readonly selected?: number;
  onSelect?(index: number): void;
  onKeypress?(keyFull: string): boolean;
  readonly footer?: string;
  readonly textPaddingLeft?: number;
  readonly textPaddingRight?: number;
  readonly itemWrapPrefixLen?: number;
}
