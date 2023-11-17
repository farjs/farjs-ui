export interface TaskManagerUiProps {
  readonly showLoading: boolean;
  readonly onHideStatus(): void;
  readonly onCloseErrorPopup(): void;
  readonly status?: string;
  readonly error?: string;
  readonly errorDetails?: string;
}
