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
      ({ department }) => department.toLowerCase() === key.toLowerCase()
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
};

export default Templates;
