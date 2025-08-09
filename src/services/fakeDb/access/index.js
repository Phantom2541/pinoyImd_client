import collections from "./collections.json";
// Category-based Access Control
/*
 10 = Laboratory
 11 = Radiology
 18 = Clinic
 4 = Cashier
 20 = Service Engineer
 13 = Procurement
*/
const laboratory = [10, 18, 4];
const radiology = [11, 18, 4];
const accessMap = {
  laboratory,
  radiology,
  diagnostics: [...new Set([...laboratory, ...radiology])],
  supplier: [20, 13],
};
//sort by descending
const sort = (datas) => datas.sort((a, b) => a.name.localeCompare(b.name));

const Access = {
  collections: sort(collections),
  getByCategory: (category) => {
    const ids = new Set(Object.values(accessMap).flat());
    const uncategorizedItems = collections.filter(({ id }) => !ids.has(id));
    const categoryItems = collections.filter(({ id }) =>
      accessMap[category.toLowerCase()]?.includes(id)
    );
    return sort([...uncategorizedItems, ...categoryItems]);
  },
};

export default Access;
