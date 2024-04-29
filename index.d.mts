import "react";
import { DetailedBlessedProps } from "react-blessed";
import Blessed from "@farjs/blessed";

type ButtonElement = Blessed.Widgets.ButtonElement;
type FormElement = Blessed.Widgets.FormElement<any>;
type TextElement = Blessed.Widgets.TextElement;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      button: DetailedBlessedProps<ButtonElement>;
      form: DetailedBlessedProps<FormElement>;
      text: DetailedBlessedProps<TextElement>;
    }
  }
}
