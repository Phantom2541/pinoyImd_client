import { capitalize } from "../../../utilities";
import collections from "./collections.json";

/**
 * Department Finder Utility
 */
const Templates = {
  collections: [...collections],

  /**
   * Finds the components of a department
   * @param {String} key Department name
   * @returns {Array} Array of component names
   */

  getComponents: (key) => {
    const department = collections.find(
      ({ department }) => department?.toLowerCase() === key?.toLowerCase()
    );
    return department
      ? [...department.components].sort((a, b) => a.localeCompare(b))
      : [];
  },
  /**
   * Finds the index of the component in the department
   * @param {String} component Component name
   * @param {String} [key=LAB] Department name
   * @returns {Number} Index of the component in the department
   */
  getComponentIndex: (component, key = "LAB") => {
    const { components } = collections.find(
      ({ department }) => department === key
    );
    const index = components.findIndex((c) => c.startsWith(component));
    return index;
  },

  getComponentName: (component, key = "LAB") => {
    const department = collections.find(({ department }) => department === key);
    if (!department) {
      console.warn(`Department "${key}" not found in templates`);
      return undefined;
    }
    const name = department.components[component];
    if (!name) {
      console.warn(
        `Component ID "${component}" not found in department "${key}"`
      );
      return undefined;
    }

    return name;
  },

  /**
   * Finds the department based on the component name
   * @param {String} componentName
   * @returns {Object} The department object
   */
  findByComponentName: (form) =>
    collections.find(({ components }) => components.includes(capitalize(form))),

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Finds the department and index of the component name
   * @param {String} componentName
   * @returns {Object} The department and index of the component
   * @property {String} department - The department name
   * @property {String} component - The component name
   * @property {Number} index - The index of the component in the department
   */
  /******  774fb717-c555-4181-8be2-ec170623beb5  *******/
  findComponentByIndex: (index) => {
    let currentIndex = 0;

    for (const { template, components } of collections) {
      if (index < currentIndex + components.length) {
        return { template, component: components[index - currentIndex] };
      }
      currentIndex += components.length;
    }

    return null; // If index is out of bounds
  },
  whereDepartment: (departmentList) =>
    collections.filter(({ department }) => departmentList.includes(department)),

  whereComponent: (componentList) =>
    collections.filter(({ components }) =>
      components.some((comp) => componentList.includes(comp))
    ),
  whereTemplate: (templateList, department) => {
    const { components } = collections.find(
      ({ department: dep }) => dep === department
    );
    return templateList
      .map((index) => components[index])
      .filter((value) => value !== undefined && value !== "");
  },
  getComponentIndices: (componentList = [], _department = "LAB") => {
    const deptIndexMap = {};
    const deptIndexMapping = { LAB: 0, RAD: 1, CLINIC: 2 };

    for (const { department, components } of collections) {
      const departmentIndex = deptIndexMapping[department];

      const indices = components.reduce((acc, component, idx) => {
        if (componentList.includes(component)) {
          acc.push(idx);
        }
        return acc;
      }, []);

      if (indices.length > 0) {
        deptIndexMap[departmentIndex] = indices;
      }
    }

    return deptIndexMap;
  },
  /**
   * Get codes from an array of component indices for a department
   * @param {Array<Number>} indices - Array of component indices
   * @param {String} department - Department name (default: LAB)
   * @returns {Array<String>} Array of codes corresponding to the indices
   */
  getWordByIndices: (indices = {}, type = "codes", department = "LAB") => {
    const dept = collections.find(({ department: dep }) => dep === department);
    if (!dept) {
      console.warn(`Department "${department}" not found`);
      return [];
    }
    const { images, ...rest } = indices;
    const haveSections = Object.keys(rest).length > 0;
    const list = type === "components" ? dept.components : dept.codes;
    const _indices = Object.values(rest).flat();
    return haveSections
      ? _indices?.map((i) => list[i]).filter((item) => item !== undefined)
      : [];
  },
  getDepartmentsByComponents: (componentList = []) => {
    const departments = [];

    for (const { department, components } of collections) {
      const hasComponent = components.some((component) =>
        componentList.includes(component)
      );
      if (hasComponent) {
        departments.push(department);
      }
    }

    return departments;
  },

  getComponentByAbbr: (abbr) => {
    const match = collections.find((c) => c.codes.includes(abbr));
    if (!match) return null;
    const index = match.codes.indexOf(abbr);
    return match.components[index] || null;
  },

  getAbbr: (section) => {
    const match = collections.find((c) => c.components.includes(section));
    return match ? match.codes[match.components.indexOf(section)] : null;
  },
};

export default Templates;
