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

const normalizeId = (value = "") => String(value || "").trim();

const getCompanyId = (affiliation = {}) =>
  normalizeId(
    affiliation?.branch?.companyId?._id ||
      affiliation?.companyId?._id ||
      affiliation?.company?._id ||
      affiliation?.branch?.companyId ||
      affiliation?.companyId ||
      affiliation?.company,
  );

const isMainBranch = (branch = {}) =>
  Boolean(
    branch?.isMain ||
      String(branch?.displayname || "").trim().toLowerCase() === "main",
  );

const resolveMainBranch = (activePlatform = {}, branches = []) => {
  const activeBranch = activePlatform?.branch || {};

  if (isMainBranch(activeBranch)) return activeBranch;

  const activeCompanyId = normalizeId(
    activeBranch?.companyId?._id || activePlatform?.company?._id,
  );

  if (!activeCompanyId) return activeBranch;

  const matchedAffiliation = (Array.isArray(branches) ? branches : []).find(
    (affiliation = {}) =>
      getCompanyId(affiliation) === activeCompanyId &&
      isMainBranch(affiliation?.branch || affiliation),
  );

  return matchedAffiliation?.branch || matchedAffiliation || activeBranch;
};

const isPhilHealthAccredited = (branch = {}) => {
  if (typeof branch?.phi?.accredited === "boolean") {
    return branch.phi.accredited;
  }

  const start = branch?.phi?.validity?.start
    ? new Date(branch.phi.validity.start)
    : null;
  const end = branch?.phi?.validity?.end
    ? new Date(branch.phi.validity.end)
    : null;

  if (!start || !end) return false;

  const now = new Date();
  return start <= now && end >= now;
};

const hasHMO = (branch = {}) => {
  if (typeof branch?.hasHMO === "boolean") return branch.hasHMO;
  return Array.isArray(branch?.hmo) && branch.hmo.length > 0;
};

const filterCashierItems = (items = [], options = {}) => {
  const { activePlatform = {}, branches = [] } = options;
  const mainBranch = resolveMainBranch(activePlatform, branches);
  const allowPhilHealth = isPhilHealthAccredited(mainBranch);
  const allowHmo = hasHMO(mainBranch);

  return items.reduce((accumulator, item) => {
    if (!allowPhilHealth && item?.path === "/express-lane") return accumulator;
    if (!allowHmo && item?.path === "/authorization") return accumulator;

    const nextItem = item?.children?.length
      ? {
          ...item,
          children: filterCashierItems(item.children, options),
        }
      : item;

    return [...accumulator, nextItem];
  }, []);
};

export const getPlatformSidebar = (
  platform,
  { isDiagnostics = true, activePlatform = {}, branches = [] } = {},
) => {
  const platformKey = Access.normalizePlatformKey(platform).replace(/_/g, "");
  const group = resolveSidebarGroup(isDiagnostics);

  if (!platformKey) return group.patron || [];

  const sidebar = group[platformKey] || [];

  if (platformKey === "cashier") {
    return filterCashierItems(sidebar, { activePlatform, branches });
  }

  return sidebar;
};

export const getPlatformDefaultRoute = (
  platform,
  { isDiagnostics = true, activePlatform = {}, branches = [] } = {},
) => {
  const sidebar = getPlatformSidebar(platform, {
    isDiagnostics,
    activePlatform,
    branches,
  });
  const defaultPath = sidebar.find(
    ({ path }) => typeof path === "string",
  )?.path;

  if (!defaultPath) {
    return `/${Access.normalizePlatformKey(platform || "patron")}`;
  }

  return `/${Access.normalizePlatformKey(platform || "patron")}${defaultPath}`;
};

export default Sidebars;
