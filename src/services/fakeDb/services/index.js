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

  whereIn: (cluster) => collections.filter(({ id }) => cluster.includes(id)),

  whereNotIn: (cluster) =>
    collections.filter(({ id }) => !cluster.includes(id)),
};

export default Services;
