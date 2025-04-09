import collections from "./collections.json";
import Templates from "../../../diagnostics/templates/index.js";
const prioritizedSort = () => {
  const prefOrder = ["development", "equal", "gender", ""];

  const customSort = (a, b) => {
    const prefA = prefOrder.indexOf(a.preference),
      prefB = prefOrder.indexOf(b.preference);

    if (prefA === prefB) return a.name.localeCompare(b.name);

    return prefA - prefB;
  };

  return collections.sort(customSort);
};

const Services = {
  collections: [...prioritizedSort()],
  find: (pk) => collections.find(({ id }) => id === Number(pk)),

  getName: function (pk) {
    return this.find(pk)?.name || `No name found for: ${pk}`;
  },
  getAbbr: function (pk) {
    return this.find(pk)?.abbreviation || `No abbr found for ( ${pk})`;
  },

  whereIn: (cluster) => collections?.filter(({ id }) => cluster?.includes(id)),

  whereNotIn: (cluster) =>
    collections.filter(({ id }) => !cluster.includes(id)),
  filterByTemplate: (pk) =>
    collections.filter(({ template }) => template === Number(pk)),

  /**
   * Given a cluster, return an array of department names that match the cluster
   * @param {array} cluster The cluster to filter the department names by
   * @returns {array} An array of department names or ["unknown department"] if no departments are found
   */
  getDepartment: (cluster) => {
    if (cluster.length < 0) return ["unknown department"]; // Return as an array

    // Filter and map to get an array of department names
    const departments = collections
      .filter(({ id }) => cluster.includes(id)) // Filter collections where the id matches cluster
      .map(({ department }) => department); // Map to get only the department field

    // Remove duplicates by converting the array to a Set and back to an array
    const uniqueDepartments = [...new Set(departments)];

    // Return the array of departments or ["unknown department"] if no departments were found
    return departments.length > 0 ? uniqueDepartments : ["unknown department"];
  },
  getTemplates: (pks, department) => {
    const cluster = collections.filter(({ id }) => pks.includes(id));
    const templates = cluster.map(({ template }) => template);
    const uniqueTemplates = [...new Set(templates)]; // Remove duplicates
    const result = {}; // This will hold the final object to return

    uniqueTemplates.forEach((id) => {
      const key = Templates.getComponentName(id, department);
      let values = cluster
        .filter(({ template }) => template === id)
        .map(({ id }) => id) // Array of ids
        .sort((a, b) => a - b);

      // Logic for switch to return object for specific cases
      switch (key) {
        case "Chemistry":
        case "Electrolyte":
        case "Serology":
          // Create an object where each id is a key with empty string as value
          values = values.reduce((acc, curr) => {
            acc[curr] = ""; // Set each id as key with empty string value
            return acc;
          }, {});
          result[key] = values; // Add the object to the result
          break;
        default:
          // For other cases, assign the array of ids
          result[key] = values; // Add the array to the result
          break;
      }
    });

    return result; // Return the final object instead of an array of objects
  },
};

export default Services;
