import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import { assertComponents, TestErrorBoundary } from "react-assert";
import Theme from "../../src/theme/Theme.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

describe("Theme.test.mjs", () => {
  it("should fail if no context when useTheme", () => {
    //given
    // suppress intended error
    // see: https://github.com/facebook/react/issues/11098#issuecomment-412682721
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction(() => {
      console.error = savedConsoleError;
    });
    console.error = consoleErrorMock;

    const Wrapper = () => {
      Theme.useTheme();
      return h(React.Fragment);
    };

    //when
    const result = TestRenderer.create(
      h(TestErrorBoundary, null, h(Wrapper))
    ).root;

    //then
    assert.deepEqual(consoleErrorMock.times, 1);
    assert.deepEqual(console.error, savedConsoleError);
    assertComponents(
      result.children,
      h(
        "div",
        null,
        "Error: Theme.Context is not found." +
          "\nPlease, make sure you use Theme.Context.Provider in parent components"
      )
    );
  });
});
