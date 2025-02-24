import collections from "./collections.json";

const Policy = {
  collections,
  getDepartment: pk => {
    const { code = "", positions = [] } =
      collections.find(({ positions = [] }) =>
        positions.some(({ id }) => id === Number(pk))
      ) || {};

    if (!code) return { department: "", role: "" };
    const role = [...positions].find(({ id }) => id === Number(pk)).name;
    return { department: code, role };
  },
  getPositions: code => {
    const { positions = [] } = collections.find(
      ({ code: department }) => department === code
    );
    return positions;
  },
};
export default Policy;
