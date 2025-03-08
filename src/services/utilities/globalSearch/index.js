const globalSearch = (collection, key = "") => {
  if (!key) return "key is required!";
  key = key?.toUpperCase(); // Normalize search key

  console.log("globalSearch collection", collection);
  console.log("globalSearch key", key);

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
