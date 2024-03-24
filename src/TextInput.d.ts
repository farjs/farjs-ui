import React from "react";
import { Widgets } from "@farjs/blessed";
import { UiString } from "./UiString";

type BlessedElement = Widgets.BlessedElement;

export interface TextInputProps {
  readonly inputRef: React.MutableRefObject<BlessedElement>;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly value: string;
  readonly state: TextInputState;
  stateUpdater(update: (state: TextInputState) => TextInputState): void;
  onChange(value: string): void;
  onEnter?(): void;
  onKeypress?(keyFull: string): boolean;
}

export interface TextInputState {
  readonly offset: number;
  readonly cursorX: number;
  readonly selStart: number;
  readonly selEnd: number;
}

export type CursorMove =
  | CursorMove.At
  | CursorMove.Home
  | CursorMove.End
  | CursorMove.Left
  | CursorMove.Right;

export namespace CursorMove {
  interface At {
    readonly move: "At";
    readonly pos: number;
  }

  interface Home {
    readonly move: "Home";
  }

  interface End {
    readonly move: "End";
  }

  interface Left {
    readonly move: "Left";
    readonly dx?: number;
  }

  interface Right {
    readonly move: "Right";
    readonly dx?: number;
  }
}

export type TextEdit = TextEdit.Insert | TextEdit.Delete | TextEdit.Backspace;

export namespace TextEdit {
  interface Insert {
    readonly edit: "Insert";
    readonly str: UiString;
  }

  interface Delete {
    readonly edit: "Delete";
  }

  interface Backspace {
    readonly edit: "Backspace";
  }
}
