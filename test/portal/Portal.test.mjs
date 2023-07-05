import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import { assertComponents, TestErrorBoundary } from "react-assert";
import Portal from "../../src/portal/Portal.mjs";
import WithPortals from "../../src/portal/WithPortals.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

describe("Portal.test.mjs", () => {
  it("should fail if no WithPortals.Context when render", () => {
    //given
    // suppress intended error
    // see: https://github.com/facebook/react/issues/11098#issuecomment-412682721
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction(() => {
      console.error = savedConsoleError;
    });
    console.error = consoleErrorMock;

    const portal = h(Portal, null, h(React.Fragment));

    //when
    const result = TestRenderer.create(h(TestErrorBoundary, null, portal)).root;

    //then
    assert.deepEqual(consoleErrorMock.times, 1);
    assert.deepEqual(console.error, savedConsoleError);
    assertComponents(
      result.children,
      h(
        "div",
        null,
        "Error: WithPortals.Context is not found." +
          "\nPlease, make sure you use WithPortals.Context.Provider in parent component."
      )
    );
  });

  it("should call onRender/onRemove when mount/un-mount", () => {
    //given
    const portalId = Portal._nextPortalId + 1;
    const content = h(React.Fragment);
    const onRender = mockFunction((resPortalId, resContent) => {
      assert.deepEqual(resPortalId, portalId);
      assert.deepEqual(resContent, content);
    });
    const onRemove = mockFunction((resPortalId) => {
      assert.deepEqual(resPortalId, portalId);
    });

    //when & then
    const renderer = TestRenderer.create(
      h(
        WithPortals.Context.Provider,
        { value: { onRender, onRemove } },
        h(Portal, null, content)
      )
    );
    assert.deepEqual(onRender.times, 1);
    assert.deepEqual(onRemove.times, 0);

    //when & then
    renderer.unmount();
    assert.deepEqual(onRender.times, 1);
    assert.deepEqual(onRemove.times, 1);
  });

  it("should call onRender if different content when update", () => {
    //given
    const portalId = Portal._nextPortalId + 1;
    const content1 = h(React.Fragment);
    const content2 = h(React.Fragment);
    const onRender = mockFunction((resPortalId, resContent) => {
      assert.deepEqual(resPortalId, portalId);

      if (onRender.times === 1) assert.deepEqual(resContent, content1);
      else assert.deepEqual(resContent, content2);
    });
    const onRemove = mockFunction((resPortalId) => {
      assert.deepEqual(resPortalId, portalId);
    });

    //when & then
    const renderer = TestRenderer.create(
      h(
        WithPortals.Context.Provider,
        { value: { onRender, onRemove } },
        h(Portal, null, content1)
      )
    );
    assert.deepEqual(onRender.times, 1);
    assert.deepEqual(onRemove.times, 0);

    //when & then
    renderer.update(
      h(
        WithPortals.Context.Provider,
        { value: { onRender, onRemove } },
        h(Portal, null, content2)
      )
    );
    assert.deepEqual(onRender.times, 2);
    assert.deepEqual(onRemove.times, 0);

    //cleanup
    renderer.unmount();
    assert.deepEqual(onRender.times, 2);
    assert.deepEqual(onRemove.times, 1);
  });

  it("should not call onRender if the same content when update", () => {
    //given
    const portalId = Portal._nextPortalId + 1;
    const content = h(React.Fragment);
    const onRender = mockFunction((resPortalId, resContent) => {
      assert.deepEqual(resPortalId, portalId);
      assert.deepEqual(resContent, content);
    });
    const onRemove = mockFunction((resPortalId) => {
      assert.deepEqual(resPortalId, portalId);
    });

    //when & then
    const renderer = TestRenderer.create(
      h(
        WithPortals.Context.Provider,
        { value: { onRender, onRemove } },
        h(Portal, null, content)
      )
    );
    assert.deepEqual(onRender.times, 1);
    assert.deepEqual(onRemove.times, 0);

    //when & then
    renderer.update(
      h(
        WithPortals.Context.Provider,
        { value: { onRender, onRemove } },
        h(Portal, null, content)
      )
    );
    assert.deepEqual(onRender.times, 1);
    assert.deepEqual(onRemove.times, 0);

    //cleanup
    renderer.unmount();
    assert.deepEqual(onRender.times, 1);
    assert.deepEqual(onRemove.times, 1);
  });
});
