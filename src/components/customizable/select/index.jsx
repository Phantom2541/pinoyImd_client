import React, { useEffect, useState } from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import "./style.css";

export default function Select({
  collections = [], // Choices
  preValue = "", // Single pre-selected value
  preValues = [], // Multiple pre-selected values
  getObject = false, // Return object instead of value
  label,
  keys, // Value key from objects
  values, // Display text key from objects
  className = "",
  inputClassName = "",
  disableAll = false,
  hideLabel = false,
  multiple = false,
  blacklisted = false,
  whitelisted = false,
  disableByKey = {},
  disableSearch = false,
  onChange = () => {},
}) {
  const [selectedValue, setSelectedValue] = useState(preValue || preValues);

  useEffect(() => {
    setSelectedValue(preValue || preValues);
  }, [preValue, preValues]);

  const handleChoiceDisabling = (value, obj) => {
    if (disableAll) return true;

    if (whitelisted) {
      if (preValue && String(preValue) === String(value)) return true;
      if (preValues.length > 0 && preValues.map(String).includes(String(value)))
        return true;
    }

    if (blacklisted) {
      if (preValue && String(preValue) !== String(value)) return true;
      if (preValues.length > 0 && preValues.map(String).includes(String(value)))
        return true;
    }

    if (Object.keys(disableByKey).length) {
      return Object.entries(disableByKey).some(
        ([key, val]) => obj[key] === val
      );
    }

    return false;
  };

  const handleSearchDisabling = () => !disableSearch && collections.length > 9;

  const handleSelection = (array) => {
    if (array.length === 0) return;

    if (multiple) {
      const selectedItems = getObject
        ? collections.filter((c) => array.includes(String(c[keys] || c)))
        : array;

      setSelectedValue(selectedItems);
      return onChange(selectedItems);
    }

    const selectedItem = getObject
      ? collections.find(
          (choice) => String(choice[keys] || choice) === String(array[0])
        )
      : array[0];

    setSelectedValue(selectedItem);
    onChange(selectedItem);
  };

  const getSelectedText = () => {
    if (multiple) {
      return preValues
        .map((val) =>
          getObject
            ? collections.find((c) => String(c[keys]) === String(val))?.[values] || val
            : val
        )
        .join(", ");
    }

    return getObject
      ? collections.find((c) => String(c[keys]) === String(preValue))?.[values] || preValue
      : preValue;
  };

  return (
    <MDBSelect
      label={!hideLabel && label}
      getValue={handleSelection}
      key={JSON.stringify(preValues)}
      className={className}
      multiple={multiple}
      color="primary"
    >
      {/* ✅ Ensure the selected value is displayed properly */}
      <MDBSelectInput className={inputClassName} selected={getSelectedText()} />

      <MDBSelectOptions search={handleSearchDisabling()}>
        {collections.map((choice, index) => {
          const key = keys ? String(choice[keys]) : String(choice);
          let value = values ? choice[values] : choice;

          return (
            <MDBSelectOption
              key={`${label}-${index}`}
              className={handleChoiceDisabling(key, choice) ? "custom-select-disabled" : ""}
              checked={multiple ? preValues.includes(key) : preValue === key}
              value={key}
            >
              {value}
            </MDBSelectOption>
          );
        })}
      </MDBSelectOptions>
    </MDBSelect>
  );
}
