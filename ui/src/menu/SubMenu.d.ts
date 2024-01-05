export interface SubMenuProps {
  readonly selected: number;
  readonly items: string[];
  readonly top: number;
  readonly left: number;
  onClick(index: number): void;
}
