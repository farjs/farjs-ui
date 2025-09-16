/**
 * @typedef {import("../../src/portal/WithPortals.mjs").WithPortalsContext} WithPortalsContext
 * @typedef {import("../../src/portal/Portal.mjs").PortalContext} PortalContext
 * @typedef {import("@farjs/blessed").Widgets.Screen} BlessedScreen
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 */
import React, { useContext } from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import { assertComponents } from "react-assert";
import Portal from "../../src/portal/Portal.mjs";
import WithPortals from "../../src/portal/WithPortals.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("WithPortals.test.mjs", () => {
  it("should add new portals when onRender", () => {
    //given
    const [portalsCtx, portalsComp] = getPortalsCtxHook();
    const [portalCtx1, portalComp1] = getPortalCtxHook("portal content 1");
    const [portalCtx2, portalComp2] = getPortalCtxHook("portal content 2");
    const focused1 = {};
    const screenMock = /** @type {BlessedScreen} */ ({ focused: focused1 });
    const withPortals = WithPortals.create(screenMock);
    const root = TestRenderer.create(
      h(
        withPortals,
        null,
        h(portalsComp),
        h(React.Fragment, null, "some other content")
      )
    ).root;

    //when & then
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(1, h(portalComp1));
    });
    assert.deepEqual(portalCtx1.current?.isActive, true);
    assertComponents(
      root.children,
      h(portalsComp),
      "some other content",
      h(portalComp1, null, "portal content 1")
    );

    //given
    const focused2 = {};
    screenMock.focused = /** @type {BlessedElement} */ (focused2);

    //when & then
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(2, h(portalComp2));
    });
    assert.deepEqual(portalCtx1.current?.isActive, false);
    assert.deepEqual(portalCtx2.current?.isActive, true);
    assertComponents(
      root.children,
      h(portalsComp),
      "some other content",
      h(portalComp1, null, "portal content 1"),
      h(portalComp2, null, "portal content 2")
    );
  });

  it("should update existing portals when onRender", () => {
    //given
    const [portalsCtx, portalsComp] = getPortalsCtxHook();
    const [portalCtx1, portalComp1] = getPortalCtxHook("portal content 1");
    const [portalCtx2, portalComp2] = getPortalCtxHook("portal content 2");
    const screenMock = /** @type {BlessedScreen} */ ({});
    const withPortals = WithPortals.create(screenMock);
    const root = TestRenderer.create(
      h(
        withPortals,
        null,
        h(portalsComp),
        h(React.Fragment, null, "some other content")
      )
    ).root;
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(1, h(portalComp1));
      portalsCtx.current?.onRender(2, h(portalComp2));
    });
    assert.deepEqual(portalCtx1.current?.isActive, false);
    assert.deepEqual(portalCtx2.current?.isActive, true);
    const [updatedCtx1, updatedComp1] = getPortalCtxHook("updated content 1");
    const [updatedCtx2, updatedComp2] = getPortalCtxHook("updated content 2");

    //when & then
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(1, h(updatedComp1));
    });
    assert.deepEqual(updatedCtx1.current?.isActive, false);
    assert.deepEqual(portalCtx2.current?.isActive, true);
    assertComponents(
      root.children,
      h(portalsComp),
      "some other content",
      h(updatedComp1, null, "updated content 1"),
      h(portalComp2, null, "portal content 2")
    );

    //when & then
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(2, h(updatedComp2));
    });
    assert.deepEqual(updatedCtx1.current?.isActive, false);
    assert.deepEqual(updatedCtx2.current?.isActive, true);
    assertComponents(
      root.children,
      h(portalsComp),
      "some other content",
      h(updatedComp1, null, "updated content 1"),
      h(updatedComp2, null, "updated content 2")
    );
  });

  it("should remove portals when onRemove", async () => {
    //given
    const [portalsCtx, portalsComp] = getPortalsCtxHook();
    const [portalCtx0, portalComp0] = getPortalCtxHook("portal content 0");
    const [portalCtx1, portalComp1] = getPortalCtxHook("portal content 1");
    const [portalCtx2, portalComp2] = getPortalCtxHook("portal content 2");
    const [portalCtx3, portalComp3] = getPortalCtxHook("portal content 3");
    const renderMock = mockFunction();
    const screenMock = /** @type {BlessedScreen} */ ({
      render: () => renderMock(),
    });

    const withPortals = WithPortals.create(screenMock);
    const root = TestRenderer.create(
      h(
        withPortals,
        null,
        h(portalsComp),
        h(React.Fragment, null, "some other content")
      )
    ).root;
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(0, h(portalComp0));
    });

    //given & when
    const focus1Mock = mockFunction();
    const focused1 = { focus: () => focus1Mock() };
    screenMock.focused = /** @type {BlessedElement} */ (focused1);
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(1, h(portalComp1));
    });

    //given & when
    const focus2Mock = mockFunction();
    const focused2 = { focus: () => focus2Mock() };
    screenMock.focused = /** @type {BlessedElement} */ (focused2);
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(2, h(portalComp2));
    });

    //given & when
    const focus3Mock = mockFunction();
    const focused3 = { focus: () => focus3Mock() };
    screenMock.focused = /** @type {BlessedElement} */ (focused3);
    TestRenderer.act(() => {
      portalsCtx.current?.onRender(3, h(portalComp3));
    });

    //then
    assert.deepEqual(portalCtx0.current?.isActive, false);
    assert.deepEqual(portalCtx1.current?.isActive, false);
    assert.deepEqual(portalCtx2.current?.isActive, false);
    assert.deepEqual(portalCtx3.current?.isActive, true);

    //when & then
    TestRenderer.act(() => {
      portalsCtx.current?.onRemove(3);
    });
    assert.deepEqual(portalCtx1.current?.isActive, false);
    assert.deepEqual(portalCtx2.current?.isActive, true);
    assertComponents(
      root.children,
      h(portalsComp),
      "some other content",
      h(portalComp0, null, "portal content 0"),
      h(portalComp1, null, "portal content 1"),
      h(portalComp2, null, "portal content 2")
    );

    //when & then
    TestRenderer.act(() => {
      portalsCtx.current?.onRemove(1);
    });
    assert.deepEqual(portalCtx2.current?.isActive, true);
    assertComponents(
      root.children,
      h(portalsComp),
      "some other content",
      h(portalComp0, null, "portal content 0"),
      h(portalComp2, null, "portal content 2")
    );

    //when & then
    TestRenderer.act(() => {
      portalsCtx.current?.onRemove(2);
    });
    assert.deepEqual(portalCtx0.current?.isActive, true);
    assertComponents(
      root.children,
      h(portalsComp),
      "some other content",
      h(portalComp0, null, "portal content 0")
    );

    //when & then
    TestRenderer.act(() => {
      portalsCtx.current?.onRemove(0);
    });
    assertComponents(root.children, h(portalsComp), "some other content");

    //then
    await Promise.resolve().then(() => {
      assert.deepEqual(focus1Mock.times, 1);
      assert.deepEqual(focus2Mock.times, 0);
      assert.deepEqual(focus3Mock.times, 1);
      assert.deepEqual(renderMock.times, 4);
    });
  });

  it("should do nothing if portal not found when onRemove", () => {
    //given
    const [portalsCtx, portalsComp] = getPortalsCtxHook();
    const renderMock = mockFunction();
    const screenMock = /** @type {BlessedScreen} */ ({
      render: () => renderMock(),
    });

    const withPortals = WithPortals.create(screenMock);
    const root = TestRenderer.create(
      h(
        withPortals,
        null,
        h(portalsComp),
        h(React.Fragment, null, "some other content")
      )
    ).root;

    //when & then
    portalsCtx.current?.onRemove(123);
    assertComponents(root.children, h(portalsComp), "some other content");

    //then
    assert.deepEqual(renderMock.times, 0);
  });

  it("should render nested portals", () => {
    //given
    const renderMock = mockFunction();
    const screenMock = /** @type {BlessedScreen} */ ({
      render: () => renderMock(),
    });

    const withPortals = WithPortals.create(screenMock);
    const root = TestRenderer.create(
      h(
        withPortals,
        null,
        h(Portal, null, "parent portal", h(Portal, null, "nested portal")),
        h(React.Fragment, null, "some other children")
      )
    ).root;

    //when & then
    assertComponents(
      root.children,
      h(Portal, null, "parent portal", h(Portal, null, "nested portal")),
      "some other children",
      "parent portal",
      h(Portal, null, "nested portal"),
      "nested portal"
    );

    //then
    assert.deepEqual(renderMock.times, 0);
  });
});

/**
 * @returns {[React.MutableRefObject<WithPortalsContext | null>, () => React.ReactElement]}
 */
function getPortalsCtxHook() {
  /** @type {React.MutableRefObject<WithPortalsContext | null>} */
  const ref = React.createRef();
  const comp = () => {
    const ctx = useContext(WithPortals.Context);
    ref.current = ctx;
    return h(React.Fragment);
  };

  return [ref, comp];
}

/**
 * @param {string} content
 * @returns {[React.MutableRefObject<PortalContext | null>, () => React.ReactElement]}
 */
function getPortalCtxHook(content) {
  /** @type {React.MutableRefObject<PortalContext | null>} */
  const ref = React.createRef();
  const comp = () => {
    const ctx = useContext(Portal.Context);
    ref.current = ctx;
    return h(React.Fragment, null, content);
  };

  return [ref, comp];
}
