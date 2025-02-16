import collections from "./collections.json";

export const Policy = {};

const Roles = {
  collections: collections,
  findById: (pk) => collections.find(({ id }) => id === pk),
};

export default Roles;
