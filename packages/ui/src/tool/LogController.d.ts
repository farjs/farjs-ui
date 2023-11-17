import React from "react";

export interface LogControllerProps {
  onReady(): void;
  render(content: string): React.ReactElement | null;
}
