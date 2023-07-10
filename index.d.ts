import "react";
import { DetailedBlessedProps } from "react-blessed";
import Blessed from "@farjs/blessed";

type FormElement = Blessed.Widgets.FormElement;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      form: DetailedBlessedProps<FormElement>;
    }
  }
}
