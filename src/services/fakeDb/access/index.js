import collections from "./collections.json";
// Category-based Access Control
/*
 10 = Laboratory
 11 = Radiology
 18 = Clinic
 4 = Cashier
 20 = Service Engineer
*/
const laboratory = [10, 18, 4];
const radiology = [11, 18, 4];
const accessMap = {
  laboratory,
  radiology,
  diagnostics: [...new Set([...laboratory, ...radiology])],
  diagnostic: [...new Set([...laboratory, ...radiology])],
  supplier: [20],
};

const platformAliases = {
  accre: "accreditation",
  accreditation: "accreditation",
  accredetation: "accreditation",
  admin: "admin",
  administrative: "admin",
  administrator: "admin",
  accounting: "accounting",
  auditor: "auditor",
  author: "author",
  cashier: "cashier",
  frontdesk: "frontdesk",
  manager: "manager",
  patron: "patron",
  hr: "humanresources",
  "human resources": "humanresources",
  human_resources: "humanresources",
  humanresources: "humanresources",
  laboratory: "laboratory",
  lab: "laboratory",
  radiology: "radiology",
  rad: "radiology",
  pharmacist: "pharmacist",
  pharmacy: "pharmacist",
  procurement: "procurement",
  utility: "utility",
  clinical: "clinical",
  clinic: "clinical",
  physician: "physician",
  dr: "physician",
  headquarter: "headquarter",
  headquarters: "headquarter",
  superadmin: "superadmin",
  "service engineer": "serviceengineer",
  service_engineer: "serviceengineer",
  serviceengineer: "serviceengineer",
  se: "serviceengineer",
};

const normalizePlatformKey = (value = "") => {
  const cleanedValue = String(value || "")
    .trim()
    .toLowerCase();

  if (!cleanedValue) return "";

  const matchedPlatform = collections.find(({ id, platform, code, name }) => {
    const normalizedId = String(id || "").trim().toLowerCase();
    const normalizedPlatform = String(platform || "").trim().toLowerCase();
    const normalizedCode = String(code || "").trim().toLowerCase();
    const normalizedName = String(name || "").trim().toLowerCase();

    return (
      normalizedId === cleanedValue ||
      normalizedPlatform === cleanedValue ||
      normalizedCode === cleanedValue ||
      normalizedName === cleanedValue
    );
  });

  const normalizedMatch = matchedPlatform
    ? String(
        matchedPlatform.code ||
          matchedPlatform.platform ||
          matchedPlatform.name ||
          matchedPlatform.id ||
          ""
      )
        .trim()
        .toLowerCase()
    : cleanedValue;

  return (
    platformAliases[normalizedMatch] ||
    platformAliases[cleanedValue] ||
    cleanedValue.replace(/\s+/g, "_")
  );
};

const getPlatformLabel = (value = "") => {
  const normalizedValue = normalizePlatformKey(value);
  const matchedPlatform = collections.find(
    ({ id, platform, code, name }) =>
      normalizePlatformKey(id) === normalizedValue ||
      normalizePlatformKey(platform) === normalizedValue ||
      normalizePlatformKey(code) === normalizedValue ||
      normalizePlatformKey(name) === normalizedValue
  );

  return matchedPlatform?.name || normalizedValue;
};
//sort by descending
const sort = (datas) => datas.sort((a, b) => a.name.localeCompare(b.name));

const Access = {
  collections: sort(collections),
  normalizePlatformKey,
  getPlatformLabel,
  getByCategory: (category) => {
    const ids = new Set(Object.values(accessMap).flat());
    const uncategorizedItems = collections.filter(({ id }) => !ids.has(id));
    const categoryItems = collections.filter(({ id }) =>
      accessMap[category?.toLowerCase()]?.includes(id)
    );
    return sort([...uncategorizedItems, ...categoryItems]);
  },
};

export default Access;
