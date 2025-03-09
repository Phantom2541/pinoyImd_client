import collections from "./collections.json";
/**
<<<<<<<< HEAD:src/services/fakeDb/finance/statements/index.js
 * feasibility statement ID
 */
const Statements = {
========
 * financial statements
 * Balance Sheet
 */
const Liabilities = {
>>>>>>>> c7c6eb628c8386741488f99e3f8290597bd6da00:src/services/fakeDb/finance/statement/index.js
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

  getName: function (pk) {
    return this.find(pk)?.title || `No name found for: ${pk}`;
  },
  getCategories: function () {
    return Array.from(new Set(collections.map(({ category }) => category)));
  },
  getAllIdByCategory: function (category) {
    return this.whereCategory([category]).map(({ id }) => id);
  },
};

export default Statements;
