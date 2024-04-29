/**
 * @typedef {import("../../src/popup/Modal.mjs").ModalProps} ModalProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import mockFunction from "mock-fn";
import Modal from "../../src/popup/Modal.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";
import Popup from "../../src/popup/Popup.mjs";
import ModalContent from "../../src/popup/ModalContent.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

Modal.popupComp = mockComponent(Popup);
Modal.modalContentComp = mockComponent(ModalContent);

const { popupComp, modalContentComp } = Modal;

describe("Modal.test.mjs", () => {
  it("should call onCancel when onClose in popup", () => {
    //given
    const onCancel = mockFunction();
    const props = { ...getModalProps(), onCancel };
    const comp = TestRenderer.create(h(Modal, props)).root;
    const popup = comp.findByType(popupComp);

    //when
    popup.props.onClose();

    //then
    assert.deepEqual(onCancel.times, 1);
  });

  it("should render component", () => {
    //given
    const props = getModalProps();
    const children = h("button", null, "some child");

    //when
    const result = TestRenderer.create(h(Modal, props, children)).root;

    //then
    assertModal(result, props, children);
  });
});

/**
 * @returns {ModalProps}
 */
function getModalProps() {
  return {
    title: "test title",
    width: 10,
    height: 20,
    style: DefaultTheme.popup.regular,
    onCancel: () => {},
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ModalProps} props
 * @param {React.ReactElement} children
 */
function assertModal(result, props, children) {
  assert.deepEqual(Modal.displayName, "Modal");

  assertComponents(
    result.children,
    h(
      popupComp,
      {
        onClose: () => {},
        focusable: undefined,
      },
      h(
        modalContentComp,
        {
          title: props.title,
          width: props.width,
          height: props.height,
          style: props.style,
          padding: undefined,
          left: undefined,
          footer: undefined,
        },
        children
      )
    )
  );
}
