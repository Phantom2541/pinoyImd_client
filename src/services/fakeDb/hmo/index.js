import collections from "./collections.json";

export const Policy = {};

const Roles = {
  collections,
  findById: (pk) => collections.find(({ id }) => id === Number(pk)),
  getName: (code) => collections.find(({ abbr }) => abbr === code)?.name,
  getSrp: (code, hmo = []) => {
    const match =
      (Array.isArray(hmo) &&
        hmo?.find((obj) => Object.keys(obj)[0] === code)) ||
      {};
    console.log("match", match, code);
    return match ? match[code] : 0;
  },
};

export default Roles;
