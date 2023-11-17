export interface SubMenuProps {
  readonly selected: number;
  readonly items: string[];
  readonly top: number;
  readonly left: number;
  readonly onClick(index: number): void;
}
