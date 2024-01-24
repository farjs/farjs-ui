/**
 * @typedef {import('../../src/popup/Popup').PopupProps} PopupProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import mockFunction from "mock-fn";
import Portal from "../../src/portal/Portal.mjs";
import PopupOverlay from "../../src/popup/PopupOverlay.mjs";
import Popup from "../../src/popup/Popup.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

Popup.portalComp = mockComponent(Portal);
Popup.popupOverlayComp = mockComponent(PopupOverlay);
const { portalComp, popupOverlayComp } = Popup;

describe("Popup.test.mjs", () => {
  it("should render component", () => {
    //given
    const children = h("box", null, "test popup child");
    const props = getPopupProps({ onClose: mockFunction() });

    //when
    const result = TestRenderer.create(h(Popup, props, children)).root;

    //then
    assert.deepEqual(Popup.displayName, "Popup");
    assertPopup(result, props, children);
  });
});

/**
 * @param {PopupProps} props
 * @returns {PopupProps}
 */
function getPopupProps(props) {
  return props;
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {PopupProps} props
 * @param {React.ReactElement} children
 */
function assertPopup(result, props, children) {
  assertComponents(
    result.children,
    h(portalComp, null, h(popupOverlayComp, props, children))
  );
}
