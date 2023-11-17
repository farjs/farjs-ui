import React from "react";

export interface WithPortalsContext {
  onRender(portalId: number, content: React.ReactNode): void;
  onRemove(portalId: number): void;
}
