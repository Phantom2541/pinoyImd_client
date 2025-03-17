import collections from "./collections.json";

const Policy = {
  collections,
  getDepartment: (pk) => {
    if (pk < 0) return "unknown department";
    const { code = 0 } =
      collections.find(({ positions = [] }) =>
        positions.some(({ id }) => id === pk)
      ) || {};
    return code;
  },
  getRole: (pk) => {
    if (pk < 0) return "unknown department";
    const { positions = [] } =
      collections.find(({ positions = [] }) =>
        positions.some(({ id }) => id === pk)
      ) || {};
    if (positions.length === 0) return "unknown designation";
    const role = [...positions].find(({ id }) => id === pk).display_name;
    return role;
  },
  getPositions: (code) => {
    const { positions = [] } = collections.find(
      ({ code: department }) => department === code
    );
    return positions;
  },
};
export default Policy;
