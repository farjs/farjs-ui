export interface TextBoxProps {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly value: string;
  onChange(value: string): void;
  onEnter?(): void;
}
