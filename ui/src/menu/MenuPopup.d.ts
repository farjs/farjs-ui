export interface MenuPopupProps {
  readonly title: string;
  readonly items: string[];
  readonly getLeft(width: number): string;
  readonly onSelect(index: number): void;
  readonly onClose(): void;
}
