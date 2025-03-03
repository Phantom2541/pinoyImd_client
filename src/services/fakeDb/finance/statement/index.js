import collections from "./collections.json";
/**
 * financial statements
 * Balance Sheet
 */
const Liabilities = {
  collections: [...collections],
  find: (pk) => collections.find(({ id }) => id === Number(pk)),
  findCategory: (data) => collections.find(({ category }) => category === data),
  // getCategory: function (pk) {
  //   return this.find(pk).category;
  // },
  whereCategory: (cluster) =>
    collections.filter(({ category }) => cluster.includes(category)),
  whereIn: (cluster) => collections?.filter(({ id }) => cluster?.includes(id)),
  whereNotIn: (cluster) =>
    collections.filter(({ id }) => !cluster.includes(id)),
};

export default Liabilities;
