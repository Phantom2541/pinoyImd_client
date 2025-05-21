const globalSearch = (collection, key = "") => {
  if (!key || typeof key !== "string") return [];
  key = key.toUpperCase(); // Normalize search key
  console.log("key in global search", key);
  const global = collection.filter((obj) => {
    console.log("obj in global search", obj);

    if (!obj) {
      console.log("obj is null or undefined");
      return false;
    }

    if (typeof obj === "object") {
      console.log("obj is an object");

      return Object.values(obj).some((value) => {
        if (typeof value === "object") {
          console.log("value is an object");

          return globalSearch([value], key).length > 0; // Recursively search nested objects
        }
        return String(value).toUpperCase().includes(key);
      });
    }
    console.log("obj is not an object");

    return String(obj).toUpperCase().includes(key);
  });
  console.log("global", global);
};

export default globalSearch;
