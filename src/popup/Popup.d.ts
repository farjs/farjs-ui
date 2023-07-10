export interface PopupProps {
  readonly onClose?: () => void;
  readonly focusable?: boolean;
  readonly onOpen?: () => void;
  readonly onKeypress?: (keyFull: string) => boolean;
}
