import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
  MDBIcon,
} from "mdbreact";
import "./style.css";

/**
 * A customizable select component with support for single and multiple selections, search, and more.
 *
 * @param {array} [collections=[]] - An array of objects to be used as options.
 * @param {string|number} [preValue=""] - The pre-selected value.
 * @param {array} [preValues=[]] - The pre-selected values.
 * @param {boolean} [getObject=false] - Whether to return the selected object or value.
 * @param {string} [label] - The label text.
 * @param {string} [keys] - The key to use for the value.
 * @param {string} [values] - The key to use for the text.
 * @param {string} [className=""] - The class name to apply to the wrapper element.
 * @param {string} [inputClassName=""] - The class name to apply to the input element.
 * @param {boolean} [disableAll=false] - Whether to disable all options.
 * @param {boolean} [hideLabel=false] - Whether to hide the label.
 * @param {boolean} [multiple=false] - Whether to allow multiple selections.
 * @param {boolean} [soloUpdate=false] - Whether to update a single selected item only.
 * @param {boolean} [blacklisted=false] - Whether to disable all options except the pre-selected ones.
 * @param {boolean} [whitelisted=false] - Whether to disable all options except the pre-selected ones.
 * @param {object} [disableByKey={}] - An object containing key-value pairs to disable options based on.
 * @param {boolean} [disableSearch=false] - Whether to disable the search feature.
 * @param {boolean} [formSubmitted=false] - Whether the form has been submitted.
 * @param {function} [onChange=() => {}] - The function to call when the selected value changes.
 * @param {function} [handleCheck=() => {}] - The function to call when the check icon is clicked.
 * @param {function} [handleClose=() => {}] - The function to call when the close icon is clicked.
 */
export default function Select({
  collections = [],
  preValue = "",
  preValues = [],
  getObject = false,
  label,
  keys, // old name values
  values, // old name texts
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
  formSubmitted = false,
  onChange = () => {},
  handleCheck = () => {},
  handleClose = () => {},
}) {
  // console.log("Select collections", collections);

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] ? acc[key] : ""), obj);
  };

  const handleChoiceDisabling = (value, obj) => {
    if (disableAll) return true;

    if (whitelisted) {
      if (preValue && String(preValue) === String(value)) return true;
      if (
        preValues?.length > 0 &&
        preValues.map(String).includes(String(value))
      )
        return true;
    }

    if (blacklisted) {
      if (preValue && String(preValue) !== String(value)) return true;
      if (
        preValues?.length > 0 &&
        preValues.map(String).includes(String(value))
      )
        return true;
    }

    if (Object.keys(disableByKey)?.length) {
      return Object.entries(disableByKey).some(
        ([key, val]) => obj[key] === val
      );
    }

    return false;
  };

  const handleSearchDisabling = () => !disableSearch && collections.length > 9;

  const handleSelection = (array) => {
    //comment by darrel
    // if (array.length === 0) return;
    // console.log("selected");
    // If soloUpdate is true, only update a single selected item

    if (multiple) {
      const selectedItems = getObject
        ? collections?.filter((c) => array.includes(String(c[keys] || c)))
        : array;

      return onChange(selectedItems);
    }
    const selectedItem = getObject
      ? collections?.find(
          (choice) => String(choice[keys] || choice) === String(array[0])
        )
      : array[0];
    return onChange(selectedItem);
  };

  const handleChecked = (value) => {
    return multiple
      ? preValues?.includes(value)
      : String(preValue) === String(value);

    // const selectedItem = getObject
    //   ? collections.find(
    //       (choice) => String(choice[keys] || choice) === String(array[0])
    //     )
    //   : array[0];

    // onChange(selectedItem);
  };

  const getSelectedText = () => {
    if (multiple) {
      return preValues
        .map((val) =>
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
  };

  return (
    <div className="d-flex align-items-center w-100">
      <MDBSelect
        label={!hideLabel && label}
        getValue={handleSelection}
        key={JSON.stringify(preValues)}
        className={`${className} w-100`}
        multiple={multiple}
        color="primary"
      >
        {/* ✅ Ensure the selected value is displayed properly */}
        <MDBSelectInput
          className={inputClassName}
          selected={getSelectedText()}
        />

        <MDBSelectOptions search={handleSearchDisabling()}>
          {collections?.map((choice, index) => {
            const key = keys ? String(choice[keys]) : choice;

            let value = values?.includes(".")
              ? getNestedValue(choice, values)
              : choice[values] || choice;

            if (typeof value === "object") {
              console.warn(
                "%c[Select] Invalid Values:",
                "color: orange; font-weight: bold;",
                "Ensure 'values' prop is correctly provided."
              );
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
                {value || "--"}
              </MDBSelectOption>
            );
          })}
        </MDBSelectOptions>
      </MDBSelect>
      {soloUpdate && (
        <div className="d-flex align-items-center ml-2">
          {!formSubmitted ? (
            <MDBIcon
              icon="check"
              onClick={handleCheck}
              style={{
                color: "blue",
                fontSize: "1rem",
                marginRight: "10px",
                marginLeft: "7px",
              }}
              className="cursor-pointer"
            />
          ) : (
            <MDBIcon
              icon="spinner"
              pulse
              style={{
                color: "black",
                fontSize: "1rem",
                marginRight: "10px",
                marginLeft: "10px",
              }}
            />
          )}
          <MDBIcon
            icon="times"
            onClick={() => handleClose()}
            className="cursor-pointer"
            style={{ color: "red", fontSize: "1rem" }}
          />
        </div>
      )}
    </div>
  );
}
