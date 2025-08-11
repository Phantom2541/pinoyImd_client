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
  getDesignationIDS: (department = "") => {
    const positions =
      collections.find(
        ({ department: d, code }) =>
          code.toLowerCase() === department.toLowerCase() ||
          d.toLowerCase() === department.toLowerCase()
      )?.positions || [];

    if (positions.length === 0) return [];
    //not included 42 Patho 43 Chief Patho 48 Radiologist 49 Chief Radiologist
    const positionIDS = positions.filter(
      ({ id }) => ![42, 43, 48, 49].includes(id)
    );
    return positionIDS.map(({ id }) => id);
  },

  getByCategory: (category) => {
    const laboratory = ["LAB", "Clinic"];
    const radiology = ["RAD", "Clinic"];

    const policyMap = {
      laboratory,
      radiology,
      diagnostics: [...new Set([...laboratory, ...radiology])],
    };

    const codesMap = new Set(Object.values(policyMap).flat());

    const departmentsInCategory = collections.filter(({ code }) =>
      policyMap[category.toLowerCase()].includes(code)
    );

    const uncategorizedItems = collections.filter(
      ({ code }) => !codesMap.has(code)
    );

    return [...uncategorizedItems, ...departmentsInCategory];
  },
};
export default Policy;
