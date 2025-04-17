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

  filterByDepartment: (packages, department) => {
    return (
      packages
        .filter((pkg) => Services.find(pkg)?.department === department)
        .map((id) => Services.find(id)).length > 0
    );
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
    // Return empty if cluster is not valid or empty
    if (!Array.isArray(cluster) || cluster.length === 0) return [];

    const departments = collections
      .filter(({ id }) => cluster.includes(id))
      .map(({ department }) => department)
      .filter(Boolean); // Remove null/undefined/empty values

    const uniqueDepartments = [...new Set(departments)];

    return uniqueDepartments.length > 0 ? uniqueDepartments : [];
  },
  getTemplates: (pks, department) => {
    const cluster = collections.filter(({ id }) => pks.includes(id));
    const templates = cluster.map(({ template }) => template);
    const uniqueTemplates = [...new Set(templates)]; // Remove duplicates
    const result = {}; // This will hold the final object to return

    uniqueTemplates.forEach((templateId) => {
      // Get the readable component name for the template ID and department
      const key = Templates.getComponentName(templateId, department);

      // Fallback in case key is undefined
      const resolvedKey = key || "Unknown";

      if (!key) {
        console.warn(
          `⚠️ Template ID "${templateId}" not mapped for department "${department}"`
        );
      }

      // Get and sort the IDs from the cluster that match this template
      let values = cluster
        .filter(({ template }) => template === templateId)
        .map(({ id }) => Number(id))
        .sort((a, b) => a - b);

      // Conditional formatting depending on the component type
      switch (resolvedKey) {
        case "Chemistry":
        case "Electrolyte":
        case "Serology":
          // Convert array to object with empty string values
          result[resolvedKey] = values.reduce((acc, id) => {
            acc[id] = "";
            return acc;
          }, {});
          break;

        default:
          // Use the sorted array of IDs as-is
          result[resolvedKey] = values;
          break;
      }
    });

    return result;
  },
};

export default Services;
