import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import "./style.css";

export default function Select({
  collections = [],
  preValue = "",
  preValues = [],
  getObject = false,
  label,
  keys,
  values,
  className = "",
  inputClassName = "",
  disableAll = false,
  hideLabel = false,
  multiple = false,
  soloUpdate = false, // New prop to control single or multiple updates
  blacklisted = false,
  whitelisted = false,
  disableByKey = {},
  disableSearch = false,
  onChange = () => {},
}) {
  // console.log("collections", collections);

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] ? acc[key] : ""), obj);
  };

  const handleChoiceDisabling = (value, obj) => {
    if (disableAll) return true;
    if (whitelisted && (preValue === value || preValues.includes(value)))
      return true;
    if (blacklisted && (!preValues.includes(value) || preValue !== value))
      return true;
    return (
      Object.keys(disableByKey).length &&
      Object.entries(disableByKey).some(([key, val]) => obj[key] === val)
    );
  };

  const handleSearchDisabling = () => !disableSearch && collections.length > 9;

  const handleSelection = (array) => {
    if (array.length === 0) return;
    if (soloUpdate) {
      // If soloUpdate is true, only update a single selected item
      const selectedItem = getObject
        ? collections.find(
            (choice) => String(choice[keys] || choice) === String(array[0])
          )
        : array[0];
      return onChange(selectedItem);
    }
    if (multiple) {
      const selectedItems = getObject
        ? collections.filter((c) => array.includes(String(c[keys] || c)))
        : array;
      return onChange(selectedItems);
    }
  };

  const handleChecked = (value) => {
    return multiple
      ? preValues.includes(value)
      : String(preValue) === String(value);
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
          let value = values.includes(".")
            ? getNestedValue(choice, values)
            : choice[values] || choice;

          if (typeof value === "object") {
            console.warn(
              "%c[Select] Invalid Value:",
              "color: orange; font-weight: bold;",
              "Ensure 'values' prop is correctly provided."
            );
            value = "Invalid Value";
          }

          return (
            <MDBSelectOption
              key={`${label}-${index}`}
              className={
                handleChoiceDisabling(key, choice)
                  ? "custom-select-disabled"
                  : ""
              }
              checked={handleChecked(key)}
              value={key || "--"}
            >
              {value || "--"} {handleChecked(key) ? "✔️" : "❌"}
            </MDBSelectOption>
          );
        })}
      </MDBSelectOptions>
    </MDBSelect>
  );
}
