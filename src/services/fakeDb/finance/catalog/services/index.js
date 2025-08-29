import collections from "./collections.json";
import Templates from "../../../diagnostics/templates/index.js";
const prioritizedSort = () => {
  const customSort = (a, b) => {
    if (a.template !== b.template) {
      return a.template - b.template;
    }
    return a.name.localeCompare(b.name);
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
    return packages.filter(
      (pkg) => Services.find(pkg)?.department === department
    );
  },

  whereIn: (cluster) => collections?.filter(({ id }) => cluster?.includes(id)),
  whereInAbbr: (cluster) =>
    collections
      ?.filter(({ id }) => cluster?.includes(id))
      .map(({ abbreviation }) => abbreviation),

  whereNotIn: (cluster) =>
    collections.filter(({ id }) => !cluster.includes(id)),
  filterByTemplate: (pk) =>
    collections.filter(({ template }) => template === Number(pk)),

  filterByStrTemplate: (department, template) => {
    if (!department) return "Department is required!!";

    const foundDepartment = Templates.collections.find(
      ({ label, department: d }) => label === department || d === department
    );

    if (!department) return -1;
    const indexOfTemplate = foundDepartment.components.indexOf(template);
    return (
      collections.filter(
        ({ template: t, department: d }) =>
          t === Number(indexOfTemplate) && foundDepartment.department === d
      ) || []
    );
  },

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
      // const key = Templates.getComponentIndex(templateId, department);
      console.log("key", key);
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
  getTemplatesWithIntKey: (pks, department) => {
    const cluster = collections.filter(({ id }) => pks.includes(id));
    const templates = cluster.map(({ template }) => template);
    const uniqueTemplates = [...new Set(templates)];
    const result = {};

    uniqueTemplates.forEach((templateId) => {
      let values = cluster
        .filter(({ template }) => template === templateId)
        .map(({ id }) => Number(id))
        .sort((a, b) => a - b);

      // Assuming you still want to treat specific templates the same way,
      // you'll need to map those component types to IDs somewhere else
      // For now, we apply the object mapping for specific IDs if needed
      const objectKeyTemplates = [
        /* list of integer keys if needed */
      ];

      if (objectKeyTemplates.includes(templateId)) {
        result[templateId] = values.reduce((acc, id) => {
          acc[id] = "";
          return acc;
        }, {});
      } else {
        result[templateId] = values;
      }
    });

    return result;
  },
};

export default Services;
