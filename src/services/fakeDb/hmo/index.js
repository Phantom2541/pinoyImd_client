import collections from "./collections.json";

export const Policy = {};

const HMO = {
  collections,
  findById: (pk) => collections.find(({ id }) => id === Number(pk)),
  getName: (_code) =>
    collections.find(({ code }) => code === _code)?.name || "-",
  getSrp: (code, hmo = []) => {
    const match =
      (Array.isArray(hmo) &&
        hmo?.find((obj) => Object.keys(obj)[0] === code)) ||
      {};
    return match ? match[code] : 0;
  },
};

export default HMO;
