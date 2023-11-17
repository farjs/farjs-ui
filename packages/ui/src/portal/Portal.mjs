import React, { useContext, useLayoutEffect, useState } from "react";
import WithPortals from "./WithPortals.mjs";

/**
 * @typedef {{readonly isActive: boolean}} PortalContext
 */

/**
 * @param {React.PropsWithChildren<{}>} props
 */
const Portal = (props) => {
  const [portalId] = useState(() => getNextPortalId());

  const ctx = useContext(WithPortals.Context);
  if (!ctx) {
    throw Error(
      "WithPortals.Context is not found." +
        "\nPlease, make sure you use WithPortals.Context.Provider in parent component."
    );
  }

  useLayoutEffect(() => {
    return () => {
      ctx.onRemove(portalId);
    };
  }, []);

  useLayoutEffect(() => {
    ctx.onRender(portalId, props.children);
  }, [props.children]);

  return null;
};

Portal.displayName = "Portal";
Portal.Context = React.createContext(
  /** @type {PortalContext} */ ({ isActive: false })
);
Portal._nextPortalId = 0;

function getNextPortalId() {
  Portal._nextPortalId += 1;
  return Portal._nextPortalId;
}

export default Portal;
