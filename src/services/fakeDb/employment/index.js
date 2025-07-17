import status from "./status";

const getValueByKey = (abbr, key) => {
  console.log("getValueByKey", abbr, key);

  if (!abbr) {
    console.error("No abbr provided");
    return "";
  }
  return employment.collections.find((e) => e.abbr === abbr)?.[key];
};

const employment = {
  //combined in one collections employed and non employed
  collections: [...status.employed, ...status.nonEmployed],
  ...status,
  isEmployed: (abbr) => getValueByKey(abbr, "isEmployed"),
  getDescription: (abbr) => getValueByKey(abbr, "description"),
  getName: (abbr) => getValueByKey(abbr, "name"),
  needReason: (key) => {
    const statusesWithReason = employment.nonEmployed.filter(
      ({ abbr }) => !["app", "int", "hir", "med", "ori"].includes(abbr)
    );

    return statusesWithReason.some(({ abbr }) => abbr === key);
  },
};

export default employment;
