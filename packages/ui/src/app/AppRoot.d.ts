import React from "react";
import { ThemeType } from "../theme/Theme";
import { DevToolType } from "../tool/DevTool.mjs";

export type MainUi = React.FC | React.ComponentClass<{}>;

export interface LoadResult {
  readonly theme: ThemeType;
  readonly mainUi: MainUi;
}

export interface AppRootProps {
  readonly loadMainUi: (dispatch: (a: any) => void) => Promise<LoadResult>;
  readonly initialDevTool: DevToolType;
  readonly defaultTheme: ThemeType;
}
