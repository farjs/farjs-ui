/**
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg} IKeyEventArg
 * @typedef {import("../src/TextInput").TextInputState} TextInputState
 * @typedef {import("../src/TextInput").TextInputProps} TextInputProps
 * @typedef {import('../src/ComboBox').ComboBoxProps} ComboBoxProps
 */
import { setTimeout } from "node:timers/promises";
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import DefaultTheme from "../src/theme/DefaultTheme.mjs";
import withThemeContext from "./theme/withThemeContext.mjs";
import PopupOverlay from "../src/popup/PopupOverlay.mjs";
import TextInput from "../src/TextInput.mjs";
import ComboBoxPopup from "../src/ComboBoxPopup.mjs";
import ComboBox from "../src/ComboBox.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

ComboBox.textInputComp = mockComponent(TextInput);
ComboBox.comboBoxPopup = mockComponent(ComboBoxPopup);
const { textInputComp, comboBoxPopup } = ComboBox;

const autoCompleteTimeoutMs = 30;

describe("ComboBox.test.mjs", () => {
  it("should call onChange, hide popup and emit keypress event when popup.onClick", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, "item 2");
    });
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        //then
        assert.deepEqual(key.name, "end");
        assert.deepEqual(key.ctrl, false);
        assert.deepEqual(key.meta, false);
        assert.deepEqual(key.shift, false);
      }
    );
    process.stdin.on("keypress", keyListener);
    const props = { ...getComboBoxProps(), onChange };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-down"),
      true
    );
    const comboBox = renderer.root.findByType(comboBoxPopup).props;

    //when
    comboBox.onClick(1);

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(onChange.times, 1);
    assert.deepEqual(keyListener.times, 1);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
  });

  it("should call onChange, hide popup and emit keypress event when onKeypress(return)", () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, "item");
    });
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        //then
        assert.deepEqual(key.name, "end");
        assert.deepEqual(key.ctrl, false);
        assert.deepEqual(key.meta, false);
        assert.deepEqual(key.shift, false);
      }
    );
    process.stdin.on("keypress", keyListener);
    const props = { ...getComboBoxProps(), onChange };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-down"),
      true
    );
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
    const textInput = renderer.root.findByType(textInputComp).props;

    //when
    assert.deepEqual(textInput.onKeypress("return"), true);

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(onChange.times, 1);
    assert.deepEqual(keyListener.times, 1);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
  });

  it("should do nothing if no items when onKeypress(return)", () => {
    //given
    const onChange = mockFunction();
    const keyListener = mockFunction();
    process.stdin.on("keypress", keyListener);
    const props = { ...getComboBoxProps(), items: [], onChange };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-down"),
      true
    );
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
    const textInput = renderer.root.findByType(textInputComp).props;

    //when
    assert.deepEqual(textInput.onKeypress("return"), true);

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(onChange.times, 0);
    assert.deepEqual(keyListener.times, 0);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
  });

  it("should do autocomplete if selected when single char", async () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, "abc");
    });
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        //then
        assert.deepEqual(key.name, "end");
        assert.deepEqual(key.ctrl, false);
        assert.deepEqual(key.meta, false);
        assert.deepEqual(key.shift, true);
      }
    );
    process.stdin.on("keypress", keyListener);
    const props = {
      ...getComboBoxProps(),
      items: ["abc", "ac"],
      value: "ad",
      onChange,
    };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    const textInput = /** @type {TextInputProps} */ (
      renderer.root.findByType(textInputComp).props
    );
    textInput.stateUpdater((s) => {
      return { ...s, selStart: 1 };
    });

    //when
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("b"),
      false
    );

    //then
    await setTimeout(autoCompleteTimeoutMs);

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(onChange.times, 1);
    assert.deepEqual(keyListener.times, 1);
  });

  it("should do autocomplete if not selected when single char", async () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, "abc");
    });
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        //then
        assert.deepEqual(key.name, "end");
        assert.deepEqual(key.ctrl, false);
        assert.deepEqual(key.meta, false);
        assert.deepEqual(key.shift, true);
      }
    );
    process.stdin.on("keypress", keyListener);
    const props = {
      ...getComboBoxProps(),
      items: ["abc", "ac"],
      value: "",
      onChange,
    };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    const textInput = renderer.root.findByType(textInputComp).props;

    //when
    assert.deepEqual(textInput.onKeypress("a"), false);

    //then
    await setTimeout(autoCompleteTimeoutMs);

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(onChange.times, 1);
    assert.deepEqual(keyListener.times, 1);
  });

  it("should do autocomplete when upper-case char", async () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, "aBc");
    });
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        //then
        assert.deepEqual(key.name, "end");
        assert.deepEqual(key.ctrl, false);
        assert.deepEqual(key.meta, false);
        assert.deepEqual(key.shift, true);
      }
    );
    process.stdin.on("keypress", keyListener);
    const props = {
      ...getComboBoxProps(),
      items: ["aBc", "ac"],
      value: "a",
      onChange,
    };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    const textInput = renderer.root.findByType(textInputComp).props;

    //when
    assert.deepEqual(textInput.onKeypress("S-b"), false);

    //then
    await setTimeout(autoCompleteTimeoutMs);

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(onChange.times, 1);
    assert.deepEqual(keyListener.times, 1);
  });

  it("should do autocomplete when space char", async () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, "a c");
    });
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        //then
        assert.deepEqual(key.name, "end");
        assert.deepEqual(key.ctrl, false);
        assert.deepEqual(key.meta, false);
        assert.deepEqual(key.shift, true);
      }
    );
    process.stdin.on("keypress", keyListener);
    const props = {
      ...getComboBoxProps(),
      items: ["a c", "ac"],
      value: "a",
      onChange,
    };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    const textInput = renderer.root.findByType(textInputComp).props;

    //when
    assert.deepEqual(textInput.onKeypress("space"), false);

    //then
    await setTimeout(autoCompleteTimeoutMs);

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(onChange.times, 1);
    assert.deepEqual(keyListener.times, 1);
  });

  it("should clear timeout when autocomplete", async () => {
    //given
    const onChange = mockFunction((value) => {
      //then
      assert.deepEqual(value, "abc");
    });
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        //then
        assert.deepEqual(key.name, "end");
        assert.deepEqual(key.ctrl, false);
        assert.deepEqual(key.meta, false);
        assert.deepEqual(key.shift, true);
      }
    );
    process.stdin.on("keypress", keyListener);
    const props = {
      ...getComboBoxProps(),
      items: ["abc", "ac"],
      value: "",
      onChange,
    };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));

    //when
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("a"),
      false
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(ComboBox, { ...props, value: "a" })));
    });
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("b"),
      false
    );

    //then
    await setTimeout(autoCompleteTimeoutMs);

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(onChange.times, 1);
    assert.deepEqual(keyListener.times, 1);
  });

  it("should hide popup when onKeypress(escape)", () => {
    //given
    const props = getComboBoxProps();
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-down"),
      true
    );
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
    const textInput = renderer.root.findByType(textInputComp).props;

    //when
    assert.deepEqual(textInput.onKeypress("escape"), true);

    //then
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
  });

  it("should hide popup if shown when onKeypress(C-up)", () => {
    //given
    const props = getComboBoxProps();
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-up"),
      true
    );
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
    const textInput = renderer.root.findByType(textInputComp).props;

    //when
    assert.deepEqual(textInput.onKeypress("C-up"), true);

    //then
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
  });

  it("should hide popup and show cursor when form.onClick", () => {
    //given
    const props = getComboBoxProps();
    const hideCursor = mockFunction();
    const showCursor = mockFunction();
    const program = { hideCursor, showCursor };
    const screen = { program };
    const formMock = { screen };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    });
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-up"),
      true
    );
    assert.deepEqual(hideCursor.times, 1);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
    const form = renderer.root.findByType("form");

    //when
    form.props.onClick();

    //then
    assert.deepEqual(showCursor.times, 1);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
  });

  it("should hide popup and show cursor when arrow.onClick", () => {
    //given
    const props = getComboBoxProps();
    const hideCursor = mockFunction();
    const showCursor = mockFunction();
    const program = { hideCursor, showCursor };
    const screen = { program };
    const formMock = { screen };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)), {
      createNodeMock: (el) => {
        return el.type === "form" ? formMock : null;
      },
    });
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-up"),
      true
    );
    assert.deepEqual(hideCursor.times, 1);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
    const arrow = renderer.root.findByType("text");

    //when
    arrow.props.onClick();

    //then
    assert.deepEqual(showCursor.times, 1);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
  });

  it("should show popup and not focus input when arrow.onClick", () => {
    //given
    const props = getComboBoxProps();
    const focus = mockFunction();
    const screen = {};
    const textMock = { screen, focus };
    screen.focused = textMock;
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    const textInput = renderer.root.findByType(textInputComp).props;
    textInput.inputRef.current = textMock;
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
    const arrow = renderer.root.findByType("text");

    //when
    arrow.props.onClick();

    //then
    assert.deepEqual(focus.times, 0);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
  });

  it("should show popup and focus input when arrow.onClick", () => {
    //given
    const props = getComboBoxProps();
    const focus = mockFunction();
    const screen = { focused: {} };
    const textMock = { screen, focus };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    const textInput = renderer.root.findByType(textInputComp).props;
    textInput.inputRef.current = textMock;
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
    const arrow = renderer.root.findByType("text");

    //when
    arrow.props.onClick();

    //then
    assert.deepEqual(focus.times, 1);
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
  });

  it("should update viewport when setViewport in popup", () => {
    //given
    const items = ["1", "2", "3"];
    const props = { ...getComboBoxProps(), items };
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-down"),
      true
    );
    const popup = renderer.root.findByType(comboBoxPopup).props;
    assert.deepEqual(popup.items, items);
    assert.deepEqual(popup.viewport.focused, 0);
    const viewport = popup.viewport.updated(popup.viewport.offset, 1);

    //when
    popup.setViewport(viewport);

    //then
    assert.deepEqual(
      renderer.root.findByType(comboBoxPopup).props.viewport === viewport,
      true
    );
  });

  it("should return false if popup not shown when onKeypress", () => {
    //given
    const props = getComboBoxProps();
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    const textInput = renderer.root.findByType(textInputComp).props;

    //when & then
    assert.deepEqual(textInput.onKeypress("escape"), false);
    assert.deepEqual(textInput.onKeypress("tab"), false);
    assert.deepEqual(textInput.onKeypress("up"), false);
    assert.deepEqual(textInput.onKeypress("down"), false);
    assert.deepEqual(textInput.onKeypress("return"), false);
    assert.deepEqual(textInput.onKeypress("unknown"), false);
  });

  it("should return true if popup is shown when onKeypress(up/down/unknown)", () => {
    //given
    const props = getComboBoxProps();
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    assert.deepEqual(
      renderer.root.findByType(textInputComp).props.onKeypress("C-up"),
      true
    );
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
    const textInput = renderer.root.findByType(textInputComp).props;

    //when & then
    assert.deepEqual(textInput.onKeypress("up"), true);
    assert.deepEqual(textInput.onKeypress("down"), true);
    assert.deepEqual(textInput.onKeypress("unknown"), true);

    //then
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 1);
  });

  it("should update input state when stateUpdater", () => {
    //given
    const props = getComboBoxProps();
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    const textInput = /** @type {TextInputProps} */ (
      renderer.root.findByType(textInputComp).props
    );

    //when & then
    textInput.stateUpdater((s) => {
      return { ...s, offset: 1, cursorX: 2, selStart: 3, selEnd: 4 };
    });

    //then
    const updatedTextInput = renderer.root.findByType(textInputComp).props;
    assert.deepEqual(updatedTextInput.state, {
      offset: 1,
      cursorX: 2,
      selStart: 3,
      selEnd: 4,
    });
  });

  it("should render popup when onKeypress(C-down)", () => {
    //given
    const props = getComboBoxProps();
    const renderer = TestRenderer.create(withThemeContext(h(ComboBox, props)));
    assert.deepEqual(renderer.root.findAllByType(comboBoxPopup).length, 0);
    const textInput = renderer.root.findByType(textInputComp).props;

    //when
    assert.deepEqual(textInput.onKeypress("C-down"), true);

    //then
    assertComboBox(renderer.root, props, true);
  });

  it("should render initial component", () => {
    //given
    const props = getComboBoxProps();

    //when
    const result = TestRenderer.create(
      withThemeContext(h(ComboBox, props))
    ).root;

    //then
    assertComboBox(result, props);
  });
});

/**
 * @returns {ComboBoxProps}
 */
function getComboBoxProps() {
  return {
    left: 1,
    top: 2,
    width: 10,
    items: ["item", "item 2"],
    value: "initial name",
    onChange: () => {},
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {ComboBoxProps} props
 * @param {boolean} [showPopup]
 */
function assertComboBox(result, props, showPopup) {
  assert.deepEqual(ComboBox.displayName, "ComboBox");

  const theme = DefaultTheme.popup.menu;
  const arrowStyle = DefaultTheme.popup.regular;
  const textInputProps = result.findByType(textInputComp).props;
  const popup = showPopup ? result.findByType(comboBoxPopup).props : null;
  if (popup) {
    assert.deepEqual(popup.viewport.focused, 0);
  }

  assertComponents(
    result.children,
    // @ts-ignore
    ...[
      h(textInputComp, {
        inputRef: textInputProps.inputRef,
        left: props.left,
        top: props.top,
        width: props.width,
        value: props.value,
        state: TextInput.createState(),
        stateUpdater: () => {},
        onChange: props.onChange,
        onEnter: props.onEnter,
        onKeypress: mockFunction(),
      }),
      h("text", {
        width: 1,
        height: 1,
        left: props.left + props.width,
        top: props.top,
        clickable: true,
        mouse: true,
        autoFocus: false,
        style: arrowStyle,
        content: ComboBox.arrowDownCh,
      }),

      popup
        ? h(
            "form",
            {
              clickable: true,
              mouse: true,
              autoFocus: false,
              style: PopupOverlay.style,
            },
            h(comboBoxPopup, {
              left: props.left,
              top: props.top + 1,
              width: props.width,
              items: ["item", "item 2"],
              viewport: popup.viewport,
              style: theme,
              setViewport: () => {},
              onClick: () => {},
            })
          )
        : null,
    ].filter((h) => h)
  );
}
