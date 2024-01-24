export interface MenuPopupProps {
  readonly title: string;
  readonly items: string[];
  getLeft(width: number): string;
  onSelect(index: number): void;
  onClose(): void;
}
