export interface MessageBoxActionType {
  readonly label: string;
  readonly onAction: () => void;
  readonly triggeredOnClose: boolean;
}
