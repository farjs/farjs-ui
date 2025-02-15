/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("@farjs/blessed").Widgets.FormElement<null> & {
 *    focusFirst(): void,
 *    _selected: BlessedElement
 * }} FormElement
 * @typedef {{
 *    full: string,
 *    defaultPrevented?: boolean
 * }} IKeyEventArg
 * @typedef {import("../../src/popup/Popup.mjs").PopupProps} PopupProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import PopupOverlay from "../../src/popup/PopupOverlay.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("PopupOverlay.test.mjs", () => {
  it("should call onOpen and focus first element if focusable when mount", () => {
    //given
    const onOpen = mockFunction();
    const props = getPopupProps({ onClose: mockFunction(), onOpen });
    const onMock = mockFunction((event, _) => {
      if (onMock.times === 1) {
        assert.deepEqual(event, "element keypress");
      } else {
        assert.deepEqual(event, "element focus");
      }
    });
    const focusFirstMock = mockFunction();
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
      focusFirst: () => {
        focusFirstMock();
      },
    });

    //when
    TestRenderer.create(h(PopupOverlay, props), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    });

    //then
    assert.deepEqual(onOpen.times, 1);
    assert.deepEqual(focusFirstMock.times, 1);
  });

  it("should not focus first element if not focusable when mount", () => {
    //given
    const props = getPopupProps({ onClose: mockFunction(), focusable: false });
    const onMock = mockFunction((event, _) => {
      if (onMock.times === 1) {
        assert.deepEqual(event, "element keypress");
      } else {
        assert.deepEqual(event, "element focus");
      }
    });
    const focusFirstMock = mockFunction();
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
      focusFirst: () => {
        focusFirstMock();
      },
    });

    //when
    TestRenderer.create(h(PopupOverlay, props), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    });

    //then
    assert.deepEqual(focusFirstMock.times, 0);
  });

  it("should remove listeners when unmount", () => {
    //given
    const props = getPopupProps({ onClose: mockFunction(), focusable: false });
    const onMock = mockFunction((event, _) => {
      //then
      if (onMock.times === 1) {
        assert.deepEqual(event, "element keypress");
      } else {
        assert.deepEqual(event, "element focus");
      }
    });
    const offMock = mockFunction((event, _) => {
      //then
      if (offMock.times === 1) {
        assert.deepEqual(event, "element keypress");
      } else {
        assert.deepEqual(event, "element focus");
      }
    });
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
      off: (event, listener) => {
        offMock(event, listener);
      },
    });

    const renderer = TestRenderer.create(h(PopupOverlay, props), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    });

    //when
    TestRenderer.act(() => {
      renderer.unmount();
    });
  });

  it("should re-subscribe element listeners when update", () => {
    //given
    const props = getPopupProps({ onClose: mockFunction(), focusable: false });
    const onMock = mockFunction((event, _) => {
      //then
      if (onMock.times === 1 || onMock.times === 3) {
        assert.deepEqual(event, "element keypress");
      } else if (onMock.times === 2 || onMock.times === 4) {
        assert.deepEqual(event, "element focus");
      }
    });
    const offMock = mockFunction((event, _) => {
      //then
      if (offMock.times === 1) {
        assert.deepEqual(event, "element keypress");
      } else {
        assert.deepEqual(event, "element focus");
      }
    });
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
      off: (event, listener) => {
        offMock(event, listener);
      },
    });

    const renderer = TestRenderer.create(h(PopupOverlay, props), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    });

    //when
    TestRenderer.act(() => {
      renderer.update(h(PopupOverlay, { ...props, onClose: mockFunction() }));
    });
  });

  it("should listen to element keys and perform actions", () => {
    /**
     * @param {boolean} defaultPrevented
     * @param {boolean} handled
     * @param {readonly string[]} keys
     * @returns {void}
     */
    function check(defaultPrevented, handled, ...keys) {
      keys.forEach((key) => {
        //given
        const onClose = mockFunction();
        const onKeypress = !defaultPrevented
          ? mockFunction((resKey) => {
              assert.deepEqual(resKey, key);
              return handled;
            })
          : undefined;
        const props = getPopupProps({ onClose, focusable: false, onKeypress });
        /** @type {(el: any, ch: any, key: IKeyEventArg) => void} */
        let keyListener = () => {};
        const onMock = mockFunction((event, listener) => {
          if (event === "element keypress") {
            keyListener = listener;
          }
        });
        const focusNextMock = mockFunction();
        const focusPreviousMock = mockFunction();
        const formMock = /** @type {FormElement} */ ({
          on: (event, listener) => {
            onMock(event, listener);
          },
          focusNext: () => {
            focusNextMock();
          },
          focusPrevious: () => {
            focusPreviousMock();
          },
        });
        TestRenderer.create(h(PopupOverlay, props), {
          createNodeMock: (el) => {
            return el.type === "form" ? formMock : null;
          },
        });

        //when
        keyListener(null, null, {
          full: key,
          defaultPrevented,
        });

        //then
        let onCloseExpected = 0;
        let focusNextExpected = 0;
        let focusPreviousExpected = 0;
        if (!defaultPrevented && !handled) {
          switch (key) {
            case "escape":
              onCloseExpected = 1;
              break;
            case "tab":
            case "down":
            case "right":
              focusNextExpected = 1;
              break;
            case "S-tab":
            case "up":
            case "left":
              focusPreviousExpected = 1;
              break;
          }
        }
        assert.deepEqual(onClose.times, onCloseExpected);
        assert.deepEqual(focusNextMock.times, focusNextExpected);
        assert.deepEqual(focusPreviousMock.times, focusPreviousExpected);
      });
    }

    //when & then
    check(false, true, "escape");
    check(false, false, "escape");
    check(true, false, "escape");
    check(false, false, "tab", "down", "right");
    check(true, false, "tab", "down", "right");
    check(false, false, "S-tab", "up", "left");
    check(true, false, "S-tab", "up", "left");
    check(false, false, "unknown");
    check(true, false, "unknown");
  });

  it("should do nothing if non-closable when escape", () => {
    //given
    const props = getPopupProps({ focusable: false });
    /** @type {(el: any, ch: any, key: IKeyEventArg) => void} */
    let keyListener = () => {};
    const onMock = mockFunction((event, listener) => {
      if (event === "element keypress") {
        keyListener = listener;
      }
    });
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
    });
    TestRenderer.create(h(PopupOverlay, props), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    });

    //when
    keyListener(null, null, { full: "escape" });
  });

  it("should set form._selected element when child element is focused", () => {
    //given
    const props = getPopupProps({ focusable: false });
    const childElement = {};
    /** @type {(el: any) => void} */
    let focusListener = () => {};
    const onMock = mockFunction((event, listener) => {
      if (event === "element focus") {
        focusListener = listener;
      }
    });
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
    });
    TestRenderer.create(h(PopupOverlay, props), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    });
    assert.deepEqual(formMock._selected, undefined);

    //when
    focusListener(childElement);

    //then
    assert.deepEqual(formMock._selected, childElement);
  });

  it("should call onClose if closable when onClick", () => {
    //given
    const onClose = mockFunction();
    const props = getPopupProps({ onClose, focusable: false });
    const onMock = mockFunction();
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
    });
    const comp = TestRenderer.create(h(PopupOverlay, props), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    }).root;
    const form = comp.findByType("form");

    //when
    form.props.onClick();

    //then
    assert.deepEqual(onClose.times, 1);
  });

  it("should do nothing if non-closable when onClick", () => {
    //given
    const props = getPopupProps({ focusable: false });
    const onMock = mockFunction();
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
    });
    const comp = TestRenderer.create(h(PopupOverlay, props), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    }).root;
    const form = comp.findByType("form");

    //when
    form.props.onClick();
  });

  it("should render component", () => {
    //given
    const children = h("box", null, "test popup child");
    const props = getPopupProps({ onClose: mockFunction() });
    const onMock = mockFunction((event, _) => {
      if (onMock.times === 1) {
        assert.deepEqual(event, "element keypress");
      } else {
        assert.deepEqual(event, "element focus");
      }
    });
    const focusFirstMock = mockFunction();
    const formMock = /** @type {FormElement} */ ({
      on: (event, listener) => {
        onMock(event, listener);
      },
      focusFirst: () => {
        focusFirstMock();
      },
    });

    //when
    const result = TestRenderer.create(h(PopupOverlay, props, children), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    }).root;

    //then
    assert.deepEqual(PopupOverlay.displayName, "PopupOverlay");
    assert.deepEqual(focusFirstMock.times, 1);
    assertPopupOverlay(result, children);
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
 * @param {React.ReactElement} children
 */
function assertPopupOverlay(result, children) {
  assertComponents(
    result.children,
    h(
      "form",
      {
        clickable: true,
        mouse: true,
        autoFocus: false,
        style: PopupOverlay.style,
      },
      children
    )
  );
}
