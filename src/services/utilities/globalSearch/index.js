const globalSearch = (collection, key) => {
  key = key.toUpperCase(); // Normalize search key

  // console.log("collection", collection);
  // console.log("key", key);

  return collection.filter((obj) => {
    if (!obj) return false;

    if (typeof obj === "object") {
      return Object.values(obj).some((value) => {
        if (typeof value === "object") {
          return globalSearch([value], key).length > 0; // Recursively search nested objects
        }
        return String(value).toUpperCase().includes(key);
      });
    }

    return String(obj).toUpperCase().includes(key);
  });
};

export default globalSearch;
