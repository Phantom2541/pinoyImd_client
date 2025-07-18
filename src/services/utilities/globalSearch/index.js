// const globalSearch = (collection, key = "") => {
//   if (!key || typeof key !== "string") return [];
//   key = key.toUpperCase(); // Normalize search key
//   return collection.filter((obj) => {
//     if (!obj) {
//       return false;
//     }

//     if (typeof obj === "object") {
//       return Object.values(obj).some((value) => {
//         if (typeof value === "object") {
//           return globalSearch([value], key).length > 0; // Recursively search nested objects
//         }
//         return String(value).toUpperCase().includes(key);
//       });
//     }

//     return String(obj).toUpperCase().includes(key);
//   });
// };

// export default globalSearch;

//new version
const globalSearch = (collection, key = "") => {
  if (!key || typeof key !== "string") return [];

  // Remove spaces and special characters, convert to uppercase
  const normalize = (str) => str.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  key = normalize(key);

  const flattenObject = (obj) => {
    let result = [];

    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") {
        result = result.concat(flattenObject(value));
      } else {
        result.push(String(value));
      }
    }

    return result;
  };

  return collection.filter((obj) => {
    if (!obj || typeof obj !== "object") return false;

    const allValues = normalize(flattenObject(obj).join(""));
    return allValues.includes(key);
  });
};

export default globalSearch;
