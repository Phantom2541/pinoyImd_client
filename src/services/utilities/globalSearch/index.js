const globalSearch = (collection, key) =>
  collection.filter((obj) => {
    if (obj) {
      if (typeof obj === "object") {
        let nestedResults = globalSearch(Object.values(obj), key);
        return nestedResults.length > 0;
      } else if (String(obj).toUpperCase().includes(key.toUpperCase())) {
        return true;
      }
    }
    return false;
  });

export default globalSearch;
