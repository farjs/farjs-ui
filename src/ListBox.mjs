/**
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg} IKeyEventArg
 * @typedef {import("./ListBox").ListBoxProps} ListBoxProps
 */
import React, { useLayoutEffect, useState } from "react";
import { createListViewport } from "./ListViewport.mjs";
import ListView from "./ListView.mjs";
import ScrollBar from "./ScrollBar.mjs";

const h = React.createElement;

/**
 * @param {ListBoxProps} props
 */
const ListBox = (props) => {
  const { listViewComp, scrollBarComp } = ListBox;

  const [viewport, setViewport] = useState(
    createListViewport(props.selected, props.items.length, props.height)
  );
  const selected = viewport.offset + viewport.focused;
  /** @type {(ch: any, key: IKeyEventArg) => void} */
  const onKeypress = (_, key) => {
    switch (key.full) {
      case "return":
        props.onAction(selected);
        break;
      default:
        const vp = viewport.onKeypress(key.full);
        if (vp) {
          setViewport(vp);
        }
        break;
    }
  };

  useLayoutEffect(() => {
    props.onSelect?.call(null, selected);
  }, [selected]);

  return h(
    "button",
    {
      left: props.left,
      top: props.top,
      width: props.width,
      height: props.height,
      onKeypress,
    },
    h(listViewComp, {
      left: 0,
      top: 0,
      width: props.width,
      height: props.height,
      items: props.items,
      viewport,
      setViewport,
      style: props.style,
      onClick: props.onAction,
    }),

    viewport.length > viewport.viewLength
      ? h(scrollBarComp, {
          left: props.width,
          top: 0,
          length: viewport.viewLength,
          style: props.style,
          value: viewport.offset,
          extent: viewport.viewLength,
          min: 0,
          max: viewport.length - viewport.viewLength,
          onChange: (offset) => {
            setViewport(viewport.updated(offset));
          },
        })
      : null
  );
};

ListBox.displayName = "ListBox";
ListBox.listViewComp = ListView;
ListBox.scrollBarComp = ScrollBar;

export default ListBox;
