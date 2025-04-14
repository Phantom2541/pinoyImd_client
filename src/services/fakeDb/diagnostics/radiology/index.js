import collections from "./collections.json";

const Services = {
  collections: [...collections],
  find: (pk) => collections.find(({ id }) => id === Number(pk)),
  getName: function (pk) {
    return this.find(pk)?.name || `No name found for: ${pk}`;
  },
  whereIn: (cluster) => collections?.filter(({ id }) => cluster?.includes(id)),
  whereNotIn: (cluster) =>
    collections.filter(({ id }) => !cluster.includes(id)),
};

export default Services;
