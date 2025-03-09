import templates from "./collections.json";

/**
 * Department Finder Utility
 */
const TemplatetUtils = {
  collections: [...templates],

  /**
   * Finds the components of a department
   * @param {String} key Department name
   * @returns {Array} Array of component names
   */
  getComponents: (key) => {
    const department = templates.find(({ department }) => department === key);
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
  getComponentIndex: (component, key = `LAB`) => {
    const department = templates.find(({ department }) => department === key);
    const components = department ? department.components : [];
    return components.indexOf(component);
  },
  getComponentName: (component, key = `LAB`) => {
    const department = templates.find(({ department }) => department === key);
    return department.components[component];
  },

  /**
   * Finds the department based on the component name
   * @param {String} componentName
   * @returns {Object} The department object
   */
  findComponentName: (componentName) =>
    templates.find(({ components }) => components.includes(componentName)),

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

    for (const { template, components } of templates) {
      if (index < currentIndex + components.length) {
        return { template, component: components[index - currentIndex] };
      }
      currentIndex += components.length;
    }

    return null; // If index is out of bounds
  },
  whereDepartment: (departmentList) =>
    templates.filter(({ department }) => departmentList.includes(department)),

  whereComponent: (componentList) =>
    templates.filter(({ components }) =>
      components.some((comp) => componentList.includes(comp))
    ),
};

export default TemplatetUtils;
