/**
 * @typedef {import("@farjs/blessed").Widgets.Screen} BlessedScreen
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("./Portal.mjs").PortalContext} PortalContext
 */
import React, { useMemo, useState } from "react";
import Portal from "./Portal.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly id: number;
 *  readonly content: React.ReactNode;
 *  readonly focused: BlessedElement;
 * }} PortalItem
 */

/**
 * @typedef {{
 *  onRender(portalId: number, content: React.ReactNode): void;
 *  onRemove(portalId: number): void;
 * }} WithPortalsContext
 */

const WithPortals = {
  Context: React.createContext(/** @type {WithPortalsContext | null} */ (null)),

  /**
   * @param {BlessedScreen} screen
   */
  create: (screen) => {
    /**
     * @param {React.PropsWithChildren<{}>} props
     */
    const WithPortalsComp = (props) => {
      const [portals, setPortals] = useState(
        /** @type {readonly PortalItem[]} */ ([])
      );

      /** @type {WithPortalsContext} */
      const context = useMemo(() => {
        return {
          onRender: (id, content) => {
            setPortals((portals) => {
              const index = portals.findIndex((p) => p.id === id);
              if (index >= 0) {
                return portals.map((p) => {
                  return p.id === id ? { ...p, content } : p;
                });
              }

              return [...portals, { id, content, focused: screen.focused }];
            });
          },
          onRemove: (id) => {
            setPortals((portals) => {
              const index = portals.findIndex((p) => p.id === id);
              if (index >= 0) {
                const { focused } = portals[index];
                let updated;
                if (index === portals.length - 1) {
                  if (focused) {
                    focused.focus();
                  }
                  updated = portals.slice(0, index);
                } else {
                  const prefix = portals.slice(0, index);
                  const suffix = portals.slice(index + 1);
                  const p = suffix[0];
                  suffix[0] = { ...p, focused };
                  updated = [...prefix, ...suffix];
                }

                Promise.resolve().then(() => screen.render()); //trigger re-render on the next tick
                return updated;
              }

              return portals;
            });
          },
        };
      }, []);

      const lastPortalIndex = portals.length - 1;

      return h(
        React.Fragment,
        null,
        h(WithPortals.Context.Provider, { value: context }, props.children),
        h(
          WithPortals.Context.Provider,
          { value: context },
          ...portals.map(({ id, content }, index) => {
            return renderPortal(id, content, index === lastPortalIndex);
          })
        )
      );
    };

    WithPortalsComp.displayName = "WithPortals";
    return WithPortalsComp;
  },
};

/**
 * @param {number} id
 * @param {React.ReactNode} content
 * @param {boolean} isActive
 * @returns {React.ReactElement}
 */
function renderPortal(id, content, isActive) {
  return h(
    React.Fragment,
    { key: `${id}` },
    h(Portal.Context.Provider, { value: { isActive } }, content)
  );
}

export default WithPortals;
