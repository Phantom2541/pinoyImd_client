import collections from "./collections.json";

export const Policy = {};

const Services = {
  collections: collections,
  find: (pk) => collections.find(({ id }) => id === pk),
  departments: () => collections.filter(({ department }) => department),
  positions: (key) =>
    collections.find(
      ({ department, positions }) => department === key && positions
    ),
    findByCode: (key) => collections.find(({ code }) => code === key),
};

export default Services;
