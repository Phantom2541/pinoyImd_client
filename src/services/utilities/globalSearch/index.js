const globalSearch = (collection, key = "") => {
  if (!key) return [];
  key = key?.toUpperCase(); // Normalize search key
  return collection.filter((obj) => {
    if (!obj) return false;
    console.log("object", obj);

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
