import collections from "./collections.json";

const quotes = {
  collections,
  getQuote: (pk) => collections.find(({ id }) => id === pk)?.name,
};

export default quotes;
