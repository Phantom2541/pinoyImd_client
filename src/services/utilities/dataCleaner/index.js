/**
 * Removes properties with undefined, empty arrays ([]), and empty objects ({}).
 *
 * @param {Object} obj - The object to clean.
 * @returns {Object} A new object without undefined, empty objects, or empty arrays.
 */
const removeEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length === 0
      )
        return false;
      return true;
    })
  );
};

export default removeEmptyValues;
