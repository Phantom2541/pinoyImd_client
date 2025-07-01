import collections from "./collections.json";

export const Policy = {};

const HMO = {
  collections,

  findById: (pk) => collections.find(({ id }) => id === Number(pk)),

  getName: (_code) =>
    collections.find(({ code }) => code === _code)?.name || "-",

  getAbbr: (_code) =>
    collections.find(({ code }) => code === _code)?.abbr || "-",

  getIcon: (_code) =>
    collections.find(({ code }) => code === _code)?.icon ||
    "/asset/logo/default.png",

  getSrp: (code, hmo = []) => {
    const match =
      (Array.isArray(hmo) &&
        hmo?.find((obj) => Object.keys(obj)[0] === code)) ||
      {};
    return match ? match[code] : 0;
  },

  search: (term = "") =>
    collections.filter(({ name, abbr }) =>
      `${name} ${abbr}`.toLowerCase().includes(term.toLowerCase())
    ),
};

export default HMO;
