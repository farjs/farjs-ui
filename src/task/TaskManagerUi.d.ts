export interface TaskManagerUiProps {
  readonly showLoading: boolean;
  onHideStatus(): void;
  onCloseErrorPopup(): void;
  readonly status?: string;
  readonly error?: string;
  readonly errorDetails?: string;
}
