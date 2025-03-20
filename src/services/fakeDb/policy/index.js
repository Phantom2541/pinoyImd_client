import collections from "./collections.json";

const Policy = {
  collections,
  getDepartment: (pk) => {
    if (pk < 0) return "unknown department";
    const { department = "" } =
      collections.find(({ positions = [] }) =>
        positions.some(({ id }) => id === pk)
      ) || {};
    return department || "";
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
    console.log(code);
    const { positions = [] } = collections.find(
      ({ department }) => department === code
    );
    return positions;
  },

  getPosition: (pk) => {
    if (pk < 0) return collections[0].positions[0].display_name;
    const { positions = [] } =
      collections.find(({ positions = [] }) =>
        positions.some(({ id }) => id === pk)
      ) || {};
    if (positions.length === 0) return "";
    return [...positions].find(({ id }) => id === Number(pk))?.display_name;
  },

  getDefaultDesignation: (pk) => {
    //getPositionDefaultValue

    if (!pk) return "";
    const { positions = [] } =
      collections.find(({ department }) => department === pk) || {};
    return positions[0]?.id;
  },

  isValidDesignationForDepartment: (designation, department) => {
    if (!department || !designation) return false;
    const { positions = [] } =
      collections.find(({ department: d }) => d === department) || {};
    return positions.some(({ id }) => id === Number(designation));
  },
};
export default Policy;
