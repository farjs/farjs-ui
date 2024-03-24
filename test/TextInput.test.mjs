/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg & {
 *    defaultPrevented?: boolean
 * }} IKeyEventArg
 * @typedef {import('../src/TextInput').TextInputProps} TextInputProps
 * @typedef {import('../src/TextInput').TextInputState} TextInputState
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import { renderText2 } from "../src/UI.mjs";
import withThemeContext from "./theme/withThemeContext.mjs";
import DefaultTheme from "../src/theme/DefaultTheme.mjs";
import TextInput from "../src/TextInput.mjs";
import UiString from "../src/UiString.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const currTheme = DefaultTheme;

describe("TextInput.test.mjs", () => {
  it("should move cursor and grab focus when onClick", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const props = getTextInputProps(state, stateUpdater);
    const omoveMock = mockFunction((x, y) => {
      //then
      if (omoveMock.times === 1) {
        assert.deepEqual(x, 10);
        assert.deepEqual(y, 3);
      } else {
        assert.deepEqual(x, 2);
        assert.deepEqual(y, 3);
      }
    });
    const programMock = { omove: omoveMock };
    const screenMock = { program: programMock };
    const focusMock = mockFunction();
    const inputMock = {
      screen: screenMock,
      focus: focusMock,
      width: 10,
      aleft: 1,
      atop: 3,
    };
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });

    //when
    renderer.root.findByType("input").props.onClick({ x: 2, y: 3 });

    //then
    assert.deepEqual(omoveMock.times, 2);
    assert.deepEqual(focusMock.times, 1);
  });

  it("should keep cursor position when onResize", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const props = { ...getTextInputProps(state, stateUpdater), value: "test" };
    const omoveMock = mockFunction((x, y) => {
      //then
      assert.deepEqual(x, 5);
      assert.deepEqual(y, 2);
    });
    const programMock = { omove: omoveMock };
    const screenMock = { program: programMock, focused: {} };
    const focusMock = mockFunction();
    const inputMock = {
      screen: screenMock,
      focus: focusMock,
      width: 10,
      aleft: 1,
      atop: 2,
    };
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });
    screenMock.focused = inputMock;

    //when
    renderer.root.findByType("input").props.onResize();

    //then
    assert.deepEqual(omoveMock.times, 2);
    assert.deepEqual(focusMock.times, 0);
  });

  it("should show cursor when onFocus", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const props = { ...getTextInputProps(state, stateUpdater), value: "test" };
    const omoveMock = mockFunction((x, y) => {
      //then
      assert.deepEqual(x, 5);
      assert.deepEqual(y, 2);
    });
    const showCursorMock = mockFunction();
    const programMock = { omove: omoveMock, showCursor: showCursorMock };
    const cursorMock = { shape: "underline", blink: false };
    const cursorShapeMock = mockFunction((shape, blink) => {
      //then
      assert.deepEqual(shape, "underline");
      assert.deepEqual(blink, true);
    });
    const screenMock = {
      program: programMock,
      cursor: cursorMock,
      cursorShape: cursorShapeMock,
    };
    const inputMock = {
      screen: screenMock,
      width: 10,
      aleft: 1,
      atop: 2,
    };
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });

    //when
    renderer.root.findByType("input").props.onFocus();

    //then
    assert.deepEqual(omoveMock.times, 1);
    assert.deepEqual(cursorShapeMock.times, 1);
    assert.deepEqual(showCursorMock.times, 1);
  });

  it("should hide cursor when onBlur", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const props = getTextInputProps(state, stateUpdater);
    const omoveMock = mockFunction((x, y) => {
      //then
      assert.deepEqual(x, 10);
      assert.deepEqual(y, 2);
    });
    const hideCursorMock = mockFunction();
    const programMock = { omove: omoveMock, hideCursor: hideCursorMock };
    const screenMock = { program: programMock };
    const inputMock = {
      screen: screenMock,
      width: 10,
      aleft: 1,
      atop: 2,
    };
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });

    //when
    renderer.root.findByType("input").props.onBlur();

    //then
    assert.deepEqual(omoveMock.times, 1);
    assert.deepEqual(hideCursorMock.times, 1);
  });

  it("should prevent default if return true from props.onKeypress", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const onKeypress = mockFunction((keyFull) => {
      //then
      assert.deepEqual(keyFull, key.full);
      return true;
    });
    const props = { ...getTextInputProps(state, stateUpdater), onKeypress };
    const omoveMock = mockFunction((x, y) => {
      //then
      assert.deepEqual(x, props.left + cursorX);
      assert.deepEqual(y, props.top);
    });
    const width = props.width;
    const cursorX = width - 1;
    const programMock = { omove: omoveMock };
    const screenMock = { program: programMock };
    const inputMock = {
      screen: screenMock,
      width: width,
      aleft: props.left,
      atop: props.top,
    };
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });
    const key = /** @type {IKeyEventArg} */ ({ full: "C-down" });

    //when
    renderer.root.findByType("input").props.onKeypress(null, key);

    //then
    assert.deepEqual(omoveMock.times, 1);
    assert.deepEqual(onKeypress.times, 1);
    assert.deepEqual(key.defaultPrevented, true);
  });

  it("should call onEnter and prevent default if return key when onKeypress", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const onEnter = mockFunction();
    const props = { ...getTextInputProps(state, stateUpdater), onEnter };
    const omoveMock = mockFunction((x, y) => {
      //then
      assert.deepEqual(x, props.left + cursorX);
      assert.deepEqual(y, props.top);
    });
    const width = props.width;
    const cursorX = width - 1;
    const programMock = { omove: omoveMock };
    const screenMock = { program: programMock };
    const inputMock = {
      screen: screenMock,
      width: width,
      aleft: props.left,
      atop: props.top,
    };
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });
    const key = /** @type {IKeyEventArg} */ ({ full: "return" });

    //when
    renderer.root.findByType("input").props.onKeypress(null, key);

    //then
    assert.deepEqual(key.defaultPrevented, true);
    assert.deepEqual(omoveMock.times, 1);
    assert.deepEqual(onEnter.times, 1);
  });

  it("should copy selection to clipboard if C-c key when onKeypress", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const props = getTextInputProps(state, stateUpdater);
    const omoveMock = mockFunction((x, y) => {
      //then
      assert.deepEqual(x, props.left + cursorX);
      assert.deepEqual(y, props.top);
    });
    const width = props.width;
    const cursorX = width - 1;
    const programMock = { omove: omoveMock };
    const copyToClipboardMock = mockFunction((text) => {
      //then
      assert.deepEqual(text, props.value);
    });
    const screenMock = {
      program: programMock,
      copyToClipboard: copyToClipboardMock,
    };
    const inputMock = {
      screen: screenMock,
      width: width,
      aleft: props.left,
      atop: props.top,
    };
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });

    //when & then
    const copyKey = /** @type {IKeyEventArg} */ ({ full: "C-c" });
    renderer.root.findByType("input").props.onKeypress(null, copyKey);
    assert.deepEqual(copyKey.defaultPrevented, true);

    //then
    assert.deepEqual(omoveMock.times, 1);
    assert.deepEqual(copyToClipboardMock.times, 1);
  });

  it("should cut selection to clipboard if C-x key when onKeypress", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const onChange = mockFunction(
      /** @type {(value: string) => void} */ (value) => {
        //then
        assert.deepEqual(value, "");
      }
    );
    const props = { ...getTextInputProps(state, stateUpdater), onChange };
    const omoveMock = mockFunction((x, y) => {
      //then
      if (omoveMock.times === 1) {
        assert.deepEqual(x, props.left + cursorX);
        assert.deepEqual(y, props.top);
      } else {
        assert.deepEqual(x, props.left);
        assert.deepEqual(y, props.top);
      }
    });
    const width = props.width;
    const cursorX = width - 1;
    const programMock = { omove: omoveMock };
    const copyToClipboardMock = mockFunction((text) => {
      //then
      assert.deepEqual(text, props.value);
    });
    const screenMock = {
      program: programMock,
      copyToClipboard: copyToClipboardMock,
    };
    const inputMock = {
      screen: screenMock,
      width: width,
      aleft: props.left,
      atop: props.top,
    };
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });

    //when & then
    const cutKey = /** @type {IKeyEventArg} */ ({ full: "C-x" });
    renderer.root.findByType("input").props.onKeypress(null, cutKey);
    assert.deepEqual(cutKey.defaultPrevented, true);

    //then
    assert.deepEqual(omoveMock.times, 2);
    assert.deepEqual(copyToClipboardMock.times, 1);
    assert.deepEqual(onChange.times, 1);
  });

  it("should process key and prevent default when onKeypress", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
      props = { ...props, state: state };
      if (renderer) {
        TestRenderer.act(() => {
          renderer.update(withThemeContext(h(TextInput, props)));
        });
      }
    };
    let expectedOnChangeValue = "";
    const onChange = mockFunction(
      /** @type {(value: string) => void} */ (value) => {
        //then
        assert.deepEqual(value, expectedOnChangeValue);
      }
    );
    let value = "initial name";
    let props = {
      ...getTextInputProps(state, stateUpdater),
      value,
      onChange,
    };
    const omoveMock = mockFunction((x, y) => {
      //then
      assert.deepEqual(x, aleft + cursorX);
      assert.deepEqual(y, atop);
    });
    const programMock = { omove: omoveMock };
    const screenMock = { program: programMock };
    const width = 10;
    const aleft = 1;
    const atop = 2;
    const inputMock = {
      screen: screenMock,
      width: width,
      aleft: aleft,
      atop: atop,
    };

    const maxOffset = () => value.length - width + 1;
    const maxCursorX = () => width - 1;

    let offset = maxOffset();
    let cursorX = maxCursorX();
    let selStart = 0;
    let selEnd = value.length;

    const currIdx = () => offset + cursorX;

    var renderer = TestRenderer.create(withThemeContext(h(TextInput, props)), {
      createNodeMock: (el) => (el.type === "input" ? inputMock : null),
    });
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, props)));
    });

    /**
     * @param {boolean} defaultPrevented
     * @param {string} fullKey
     * @param {number} idx
     * @param {number} posX
     * @param {string} newVal
     * @param {number} [startIdx]
     * @param {number} [endIdx]
     * @param {string} [ch]
     */
    //prettier-ignore
    function check(defaultPrevented, fullKey, idx, posX, newVal, startIdx = -1, endIdx = -1, ch = undefined) {
      //given
      const key = /** @type {IKeyEventArg} */ ({ full: fullKey });

      let expectedOmoveMockTimes = 0;
      let expectedOnChangeTimes = 0;
      omoveMock.times = 0;
      onChange.times = 0;

      offset = idx;
      selStart = startIdx;
      selEnd = endIdx;
      if (cursorX !== posX) {
        cursorX = posX;
        expectedOmoveMockTimes = 1;
      }

      if (value !== newVal) {
        expectedOnChangeValue = newVal;
        expectedOnChangeTimes = 1;
      }
      const inputEl = renderer.root.findByType("input");

      //when
      inputEl.props.onKeypress(ch, key);

      //then
      assert.deepEqual(key.defaultPrevented, defaultPrevented);
      assert.deepEqual(omoveMock.times, expectedOmoveMockTimes);
      assert.deepEqual(onChange.times, expectedOnChangeTimes);

      if (value !== newVal) {
        value = newVal;
        props = { ...props, value: newVal };

        TestRenderer.act(() => {
          renderer.update(withThemeContext(h(TextInput, props)));
        });
      }

      const theme = currTheme.textBox;
      const currValue = UiString(newVal);

      //prettier-ignore
      function renderContent() {
        if (selEnd - selStart > 0) {
          const part1 = renderText2(theme.regular, currValue.slice(offset, selStart));
          const part2 = renderText2(theme.selected, currValue.slice(Math.max(selStart, offset), selEnd));
          const part3 = renderText2(theme.regular, currValue.slice(selEnd, currValue.strWidth()));
          return `${part1}${part2}${part3}`;
        }
        return renderText2(theme.regular, currValue.slice(offset, currValue.strWidth()));
      }
      assert.deepEqual(inputEl.props.content, renderContent());
    }

    //prettier-ignore
    {
    //when & then
    check(true, "enter", offset, cursorX, value, selStart, selEnd);
    check(false, "escape", offset, cursorX, value, selStart, selEnd);
    check(false, "tab", offset, cursorX, value, selStart, selEnd);

    //when & then
    check(true, "right", offset + 1, cursorX - 1, value);
    check(true, "S-home", 0, 0, value, 0, currIdx());
    check(true, "right", offset, cursorX + 1, value);
    check(true, "S-right", offset, cursorX + 1, value, currIdx(), currIdx() + 1);
    check(true, "S-left", offset, cursorX - 1, value, currIdx() - 1, selEnd);
    check(true, "S-end", maxOffset(), maxCursorX(), value, selStart, value.length);
    check(true, "C-a", maxOffset(), maxCursorX(), value, 0, value.length);
    check(true, "end", maxOffset(), maxCursorX(), value);
    check(true, "left", offset, cursorX - 1, value);
    check(true, "left", offset, cursorX - 1, value);
    check(true, "home", 0, 0, value);
    check(true, "left", offset, 0, value);
    check(true, "right", offset, 1, value);
    check(true, "right", offset, 2, value);
    check(true, "end", maxOffset(), maxCursorX(), value);

    //when & then
    check(true, "delete", offset, cursorX, value);
    check(true, "S-left", offset, cursorX - 1, value, currIdx() - 1, value.length);
    check(true, "delete", offset, cursorX, "initial nam");
    check(true, "S-left", offset, cursorX - 1, value, currIdx() - 1, value.length);
    check(true, "backspace", offset, cursorX, "initial na");
    check(true, "left", offset, cursorX - 1, value);
    check(true, "S-end", maxOffset(), maxCursorX(), value, currIdx(), value.length);
    check(true, "delete", offset, cursorX - 1, "initial n");
    check(true, "", offset, cursorX + 1, "initial n1", selStart, selEnd, "1");
    check(true, "", offset + 1, cursorX, "initial n12", selStart, selEnd, "2");
    check(true, "S-left", offset, cursorX - 1, value, currIdx() - 1, value.length);
    check(true, "S-left", offset, cursorX - 1, value, currIdx() - 1, value.length);
    check(true, "", offset, cursorX + 1, "initial na", -1, -1, "a");
    check(true, "", offset, cursorX + 1, "initial nam", selStart, selEnd, "m");
    check(true, "", offset + 1, cursorX, "initial name", selStart, selEnd, "e");
    check(true, "backspace", offset, cursorX - 1, "initial nam");
    check(true, "", offset, cursorX + 1, "initial nam1", selStart, selEnd, "1");
    check(true, "", offset + 1, cursorX, "initial nam12", selStart, selEnd, "2");
    check(true, "left", offset, cursorX - 1, value);
    check(true, "left", offset, cursorX - 1, value);
    check(true, "left", offset, cursorX - 1, value);
    check(true, "", offset, cursorX + 1, "initial na3m12", selStart, selEnd, "3");
    check(true, "", offset, cursorX + 1, "initial na34m12", selStart, selEnd, "4");
    check(true, "backspace", offset, cursorX - 1, "initial na3m12");
    check(true, "backspace", offset, cursorX - 1, "initial nam12");
    check(true, "delete", offset, cursorX, "initial na12");
    check(true, "delete", offset, cursorX, "initial na2");
    check(true, "home", 0, 0, value);
    check(true, "backspace", offset, cursorX, value);
    check(true, "delete", offset, cursorX, "nitial na2");
    check(true, "delete", offset, cursorX, "itial na2");
    check(true, "S-end", offset, maxCursorX(), value, currIdx(), value.length);
    check(true, "delete", offset, 0, "");

    //when & then
    check(true, "", offset, cursorX + 1, "и", selStart, selEnd, "и");
    check(true, "", offset, cursorX, "й", selStart, selEnd, "й".substring(1));
    check(true, "", offset, cursorX + 2, "й杜", selStart, selEnd, "杜");
    check(true, "left", offset, cursorX - 2, value);
    check(true, "S-left", offset, cursorX - 1, value, 0, 1);
    check(true, "", offset, cursorX + 2, "杜杜", -1, -1, "杜");
    check(true, "", offset, cursorX, "杜杜", selStart, selEnd, "\uD834"); //high surrogate
    check(true, "", offset, cursorX + 1, "杜\uD834\uDF06杜", selStart, selEnd, "\uDF06"); //low surrogate
    check(true, "left", offset, cursorX - 1, value);
    check(true, "backspace", offset, cursorX - 2, "\uD834\uDF06杜");
    check(true, "right", offset, cursorX + 1, value);
    check(true, "right", offset, cursorX + 2, value);
    check(true, "", offset, cursorX + 1, "\uD834\uDF06杜и", selStart, selEnd, "и");
    check(true, "", offset, cursorX, "\uD834\uDF06杜й", selStart, selEnd, "й".substring(1));
    check(true, "left", offset, cursorX - 1, value);
    check(true, "left", offset, cursorX - 2, value);
    check(true, "delete", offset, cursorX, "\uD834\uDF06й");
    check(true, "delete", offset, cursorX, "\uD834\uDF06");
    check(true, "backspace", offset, cursorX - 1, "");

    //when & then
    check(false, "up", offset, cursorX, value);
    check(false, "down", offset, cursorX, value);
    
    } //prettier-ignore
  });

  it("should render initial component", () => {
    //given
    let state = TextInput.createState();
    /** @type {(update: (state: TextInputState) => TextInputState) => void} */
    const stateUpdater = (update) => {
      state = update(state);
    };
    const props = getTextInputProps(state, stateUpdater);
    const omoveMock = mockFunction((x, y) => {
      //then
      assert.deepEqual(x, 10);
      assert.deepEqual(y, 3);
    });
    const programMock = { omove: omoveMock };
    const screenMock = { program: programMock };
    const inputMock = { screen: screenMock, width: 10, aleft: 1, atop: 3 };

    //when
    const renderer = TestRenderer.create(
      withThemeContext(h(TextInput, props)),
      {
        createNodeMock: (el) => (el.type === "input" ? inputMock : null),
      }
    );
    TestRenderer.act(() => {
      renderer.update(withThemeContext(h(TextInput, { ...props, state })));
    });

    //then
    assert.deepEqual(omoveMock.times, 1);
    assertTextInput(renderer.root, props);
  });
});

/**
 * @param {TextInputState} state
 * @param {(update: (state: TextInputState) => TextInputState) => void} stateUpdater
 * @returns {TextInputProps}
 */
function getTextInputProps(state, stateUpdater) {
  return {
    inputRef: /** @type {React.MutableRefObject<BlessedElement>} */ (
      React.createRef()
    ),
    left: 1,
    top: 2,
    width: 10,
    value: "initial name",
    state: state,
    stateUpdater: stateUpdater,
    onChange: () => {},
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {TextInputProps} props
 */
function assertTextInput(result, props) {
  assert.deepEqual(TextInput.displayName, "TextInput");

  const theme = currTheme.textBox;
  const selectedText = props.value.slice(
    Math.min(props.value.length - props.width + 1, props.value.length)
  );

  assertComponents(
    result.children,
    h("input", {
      autoFocus: false,
      clickable: true,
      keyable: true,
      width: props.width,
      height: 1,
      left: props.left,
      top: props.top,
      style: theme.regular,
      wrap: false,
      tags: true,
      content: renderText2(theme.selected, selectedText),
    })
  );
}
