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
    let displayName: string;
    let Context: React.Context<PortalContext>;
    let _nextPortalId: number;
}
import React from "react";
