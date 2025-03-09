import collections from "./collections.json";

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
    return this.find(pk)?.abbreviation || `No abbr found for`;
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
};

export default Services;
