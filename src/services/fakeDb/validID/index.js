import collections from "./collections.json";

const getByKey = (code, key) =>
  collections.find(({ code: c }) => c === code)?.[key];

const validID = {
  collections,
  getName: (pk) => getByKey(pk, "name"),
};

export default validID;
