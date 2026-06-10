import superadmin from "./superadmin";
import diagnostics from "./diagnostics";
import suppliers from "./suppliers";
import patron from "./administrations/patron";
import Access from "../access";

const Sidebars = {
  superadmin,
  diagnostics,
  suppliers,
  patron, //for patients diagnostics
};

export const resolveSidebarGroup = (isDiagnostics = true) => ({
  ...(isDiagnostics ? diagnostics : suppliers),
  superadmin,
  patron,
});

export const getPlatformSidebar = (platform, { isDiagnostics = true } = {}) => {
  const platformKey = Access.normalizePlatformKey(platform).replace(/_/g, "");
  const group = resolveSidebarGroup(isDiagnostics);

  if (!platformKey) return group.patron || [];

  return group[platformKey] || [];
};

export const getPlatformDefaultRoute = (
  platform,
  { isDiagnostics = true } = {},
) => {
  const sidebar = getPlatformSidebar(platform, { isDiagnostics });
  const defaultPath = sidebar.find(
    ({ path }) => typeof path === "string",
  )?.path;

  if (!defaultPath) {
    return `/${Access.normalizePlatformKey(platform || "patron")}`;
  }

  return `/${Access.normalizePlatformKey(platform || "patron")}${defaultPath}`;
};

export default Sidebars;
