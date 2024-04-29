export default Portal;
export type PortalContext = {
    readonly isActive: boolean;
};
/**
 * @typedef {{readonly isActive: boolean}} PortalContext
 */
/**
 * @param {React.PropsWithChildren<{}>} props
 */
declare function Portal(props: React.PropsWithChildren<{}>): null;
declare namespace Portal {
    const displayName: string;
    const Context: React.Context<PortalContext>;
    const _nextPortalId: number;
}
import React from "react";
