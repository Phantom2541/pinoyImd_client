import collections from "./collections.json";

const Policy = {
  collections,
  getDepartment: (pk) => {
    if (pk < 0) {
      console.warn("Unknown Department");
      return "";
    }
    const { department = "" } =
      collections.find(({ positions = [] }) =>
        positions.some(({ id }) => id === Number(pk))
      ) || {};
    return department || "";
  },
  getDepname: (pk) => {
    if (pk < 0) {
      console.warn("Unknown Department");
      return "";
    }
    const { department = "" } =
      collections.find(({ department: dep }) => dep === pk) || "";
    return department || "";
  },

  getPositionsByDepartmentName: (name) => {
    const match = collections.find(({ department }) => department === name);
    const positions = match?.positions || []; // fallback to empty array
    return positions;
  },
  /**
   * return  position display_name by department id
   */
  getPosition: (pk) => {
    if (pk < 0) {
      console.warn("Unknown Department");
      return "";
    }
    const { positions = [] } =
      collections.find(({ positions = [] }) =>
        positions.some(({ id }) => id === pk)
      ) || {};
    if (positions.length === 0) {
      console.warn("Unknown Designation");
      return "-";
    }
    const role = [...positions].find(({ id }) => id === pk).display_name;
    return role;
  },
  /**
   * return all positions by department id
   */
  getPositions: (pk) => {
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

  getBoardMembersIds: () => {
    const positions =
      collections.find(({ code }) => code?.toUpperCase() === "BOARD")
        ?.positions || [];
    return positions.map(({ id }) => id);
  },
};
export default Policy;
