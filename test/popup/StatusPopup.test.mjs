/**
 * @typedef {import('../../src/popup/StatusPopup').StatusPopupProps} StatusPopupProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import mockFunction from "mock-fn";
import * as UI from "../../src/UI.mjs";
import TextAlign from "../../src/TextAlign.mjs";
import TextLine from "../../src/TextLine.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import withThemeContext from "../theme/withThemeContext.mjs";
import Popup from "../../src/popup/Popup.mjs";
import ModalContent from "../../src/popup/ModalContent.mjs";
import StatusPopup from "../../src/popup/StatusPopup.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

StatusPopup.popupComp = mockComponent(Popup);
StatusPopup.modalContentComp = mockComponent(ModalContent);
StatusPopup.textLineComp = mockComponent(TextLine);

const { popupComp, modalContentComp, textLineComp } = StatusPopup;

describe("StatusPopup.test.mjs", () => {
  it("should call onClose when onClose in popup", () => {
    //given
    const onClose = mockFunction();
    const props = { ...getStatusPopupProps("test text"), onClose };
    const comp = TestRenderer.create(
      withThemeContext(h(StatusPopup, props))
    ).root;
    const popup = comp.findByType(popupComp);

    //when
    popup.props.onClose();

    //then
    assert.deepEqual(onClose.times, 1);
  });

  it("should render non-closable popup with default title", () => {
    //given
    const props = getStatusPopupProps(
      "Toooooooooooooooooooooooooooooo looooooooooooooooooooooooong test message"
    );

    //when
    const result = TestRenderer.create(
      withThemeContext(h(StatusPopup, props))
    ).root;

    //then
    assertStatusPopup(result, props);
  });

  it("should render closable popup with custom title", () => {
    //given
    const props = {
      ...getStatusPopupProps(
        "Toooooooooooooooooooooooooooooo looooooooooooooooooooooooong test message"
      ),
      title: "Test Title",
      onClose: () => {},
    };

    //when
    const result = TestRenderer.create(
      withThemeContext(h(StatusPopup, props))
    ).root;

    //then
    assertStatusPopup(result, props);
  });
});

/**
 * @param {string} text
 * @returns {StatusPopupProps}
 */
function getStatusPopupProps(text) {
  return {
    text,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {StatusPopupProps} props
 */
function assertStatusPopup(result, props) {
  assert.deepEqual(StatusPopup.displayName, "StatusPopup");

  const width = 35;
  const textWidth = width - (ModalContent.paddingHorizontal + 2) * 2;
  const textLines = UI.splitText(props.text, textWidth);
  const height = (ModalContent.paddingVertical + 1) * 2 + textLines.length;
  const theme = DefaultTheme.popup.regular;
  const style = {
    bold: theme.bold,
    bg: theme.bg,
    fg: theme.fg,
  };

  assertComponents(
    result.children,
    h(
      popupComp,
      {
        onClose: props.onClose,
      },
      h(
        modalContentComp,
        {
          title: props.title ?? "Status",
          width: width,
          height: height,
          style: style,
        },
        h(
          "button",
          {
            width: textWidth,
            height: textLines.length,
            left: 2,
            top: 1,
            style: style,
          },
          [
            ...textLines.map((text, index) => {
              return h(textLineComp, {
                key: `${index}`,
                align: TextAlign.center,
                left: 0,
                top: index,
                width: textWidth,
                text: text,
                style: style,
                padding: 0,
              });
            }),
          ]
        )
      )
    )
  );
}
