import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import "./style.css";

export default function Select({
  collections = [], // choices
  preValue = "",
  preValues = [],
  getObject = false,
  label,
  keys, // old values
  values, // old texts
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
  const handleChoiceDisabling = (value, obj) => {
    if (disableAll) return true;

    if (whitelisted) {
      // If whitelisted, allow only pre-selected values and disable them
      if (preValue && String(preValue) === String(value)) return true;
      if (preValues.length > 0 && preValues.map(String).includes(String(value)))
        return true;
    }

    if (blacklisted) {
      // If blacklisted, disable everything except pre-selected values
      if (preValue && String(preValue) !== String(value)) return true;
      if (preValues.length > 0 && preValues.map(String).includes(String(value)))
        return true;
    }

    // Check for specific keys in disableByKey
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
      return onChange(selectedItems);
    }

    const selectedItem = getObject
      ? collections.find(
          (choice) => String(choice[keys] || choice) === String(array[0])
        )
      : array[0];

    onChange(selectedItem);
  };

  const handleChecked = (value) => {
    if (multiple) {
      // If multiple selection is enabled, check against preValues
      if (whitelisted) {
        console.log(
          "whitelisted",
          preValues.map(String).includes(String(value))
        );

        return preValues.map(String).includes(String(value));
      }
      return preValues.map(String).includes(String(value));
    }

    // If not multiple, fallback to standard single selection check
    return String(preValue) === String(value);
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
      <MDBSelectInput className={inputClassName} selected={preValue} />
      <MDBSelectOptions search={handleSearchDisabling()}>
        {collections.map((choice, index) => {
          const key = keys ? String(choice[keys]) : choice;
          let value = choice[values] || choice;

          if (typeof value === "object") {
            console.warn(
              `%c[Select] Invalid Value:`,
              "color: orange; font-weight: bold;",
              "The display value is an object. Please ensure the 'values' prop is correctly provided."
            );
            value = "Invalid Value";
          }

          if (multiple && !keys) {
            console.warn(
              `%c[Select] Missing 'keys' Prop:`,
              "color: red; font-weight: bold;",
              "Multiple selection is enabled, but no 'keys' prop is provided. Ensure 'keys' is set to properly identify options."
            );
          }

          return (
            <MDBSelectOption
              key={`${label}-${index}`}
              className={
                handleChoiceDisabling(key, choice) && "custom-select-disabled"
              }
              checked={handleChecked(key)} // Now correctly checks whitelisted items
              value={key || "--"}
            >
              {value || "--"}
            </MDBSelectOption>
          );
        })}
      </MDBSelectOptions>
    </MDBSelect>
  );
}
