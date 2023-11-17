export interface WithSizeProps {
  readonly render(width: number, height: number): React.ReactElement | null;
}
