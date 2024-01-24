export interface MenuBarItem {
  readonly label: string;
  readonly subItems: string[];
}

export interface MenuBarProps {
  readonly items: MenuBarItem[];
  onAction(menuIndex: number, subIndex: number): void;
  onClose(): void;
}
