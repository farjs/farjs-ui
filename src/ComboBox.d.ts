export interface ComboBoxProps {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly items: string[];
  readonly value: string;
  onChange(value: string): void;
  onEnter?(): void;
}
