/**
 * Removes properties with undefined values from an object.
 *
 * @param {Object} obj - The object to clean of undefined values.
 * @returns {Object} A new object with only the entries that have defined values.
 */

const removeUndefinedValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
};

export default removeUndefinedValues;
