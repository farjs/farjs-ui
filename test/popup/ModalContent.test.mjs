/**
 * @typedef {import('../../src/popup/ModalContent').ModalContentProps} ModalContentProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import DoubleBorder from "../../src/border/DoubleBorder.mjs";
import ModalContent from "../../src/popup/ModalContent.mjs";
import DefaultTheme from "../../src/theme/DefaultTheme.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

ModalContent.doubleBorderComp = mockComponent(DoubleBorder);

const { doubleBorderComp } = ModalContent;

describe("ModalContent.test.mjs", () => {
  it("should render component", () => {
    //given
    const props = getModalContentProps();
    const children = h("button", null, "some child");

    //when
    const result = TestRenderer.create(h(ModalContent, props, children)).root;

    //then
    assertModalContent(result, props, children);
  });

  it("should render component with footer", () => {
    //given
    const props = {
      ...getModalContentProps(),
      padding: ModalContent.padding,
      left: 123,
      footer: "test footer",
    };
    const children = h("button", null, "some child");

    //when
    const result = TestRenderer.create(h(ModalContent, props, children)).root;

    //then
    assertModalContent(result, props, children);
  });
});

/**
 * @returns {ModalContentProps}
 */
function getModalContentProps() {
  return {
    title: "test title",
    width: 10,
    height: 20,
    style: DefaultTheme.popup.regular,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ModalContentProps} props
 * @param {React.ReactElement} children
 */
function assertModalContent(result, props, children) {
  assert.deepEqual(ModalContent.displayName, "ModalContent");

  assertComponents(
    result.children,
    h(
      "box",
      {
        clickable: true,
        autoFocus: false,
        width: props.width,
        height: props.height,
        top: "center",
        left: props.left ?? "center",
        shadow: true,
        padding: props.padding ?? {
          left: ModalContent.paddingHorizontal,
          right: ModalContent.paddingHorizontal,
          top: ModalContent.paddingVertical,
          bottom: ModalContent.paddingVertical,
        },
        style: props.style,
      },
      h(doubleBorderComp, {
        width: props.width - ModalContent.paddingHorizontal * 2,
        height: props.height - ModalContent.paddingVertical * 2,
        style: props.style,
        title: props.title,
        footer: props.footer,
      }),
      children
    )
  );
}
