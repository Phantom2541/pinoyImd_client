const utils = {
  config: {
    whitelisted: (preValue, preValues, _value) => {
      const value = String(_value);
      if (preValue && String(preValue) === value) return true;
      if (preValues?.length > 0 && preValues?.map(String).includes(value))
        return true;
    },
    blacklisted: (preValue, preValues, value) => {
      if (preValue && String(preValue) !== String(value)) return true;
      if (
        preValues?.length > 0 &&
        preValues?.map(String).includes(String(value))
      )
        return true;
    },
    disableByKey: (disableByKey, obj) => {
      if (Object.keys(disableByKey)?.length) {
        return Object.entries(disableByKey).some(
          ([key, val]) => obj[key] === val
        );
      }
    },
  },
  isChecked: (value, multiple, preValues, preValue) => {
    return multiple
      ? preValues?.includes(value)
      : String(preValue) === String(value);
  },

  isArrayOfObjects: (collections) => {
    return (
      Array.isArray(collections) &&
      collections.every(
        (item) =>
          typeof item === "object" && !Array.isArray(item) && item !== null
      )
    );
  },
  getSelectedText: (config = {}) => {
    const {
      preValue = "",
      values = "",
      keys = "",
      getObject = false,
      multiple = false,
      preValues = [],
      collections = [],
    } = config;
    if (multiple) {
      return preValues
        ?.map((val) =>
          getObject
            ? collections.find((c) => String(c[keys]) === String(val))?.[
                values
              ] || val
            : val
        )
        .join(", ");
    }

    return getObject
      ? collections.find((c) => String(c[keys]) === String(preValue))?.[
          values
        ] || preValue
      : preValue;
  },
  disableSearch: (disableSearch, collections) => {
    return !disableSearch && collections.length > 9;
  },
  disablingChoices: (config = {}) => {
    const {
      whitelisted = false,
      blacklisted = false,
      isDisableByKey = false,
      disableAll = false,
      preValue = "",
      value = "",
      disableByKey = {},
      obj = {},
      preValues = [],
    } = config;
    var isDisable = false;
    if (disableAll) isDisable = true;

    if (whitelisted) {
      isDisable = utils.config.whitelisted(preValue, preValues, value);
    }

    if (blacklisted) {
      isDisable = utils.config.blacklisted(preValue, preValues, value);
    }

    if (isDisableByKey) {
      isDisable = utils.config.disableByKey(disableByKey, obj);
    }

    return isDisable ? "custom-select-disabled" : "";
  },
};

export default utils;
