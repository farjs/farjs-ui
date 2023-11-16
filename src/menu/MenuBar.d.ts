export interface MenuBarItem {
  readonly label: string;
  readonly subItems: string[];
}

export interface MenuBarProps {
  readonly items: MenuBarItem[];
  readonly onAction(menuIndex: number, subIndex: number): void;
  readonly onClose(): void;
}
