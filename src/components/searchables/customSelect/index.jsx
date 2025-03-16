import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";

/**
 * A React component for a custom MDBSelect
 *
 * @param {array} choices - An array of objects. Each object should have at least
 * two properties: values and texts. The value property is the value that will
 * be sent to the onChange function, and the text property is the text that will
 * be displayed in the select options.
 * @param {string} preValue - The value that will be selected by default.
 * @param {function} onChange - A function that will be called with the selected
 * value(s) as its argument.
 * @param {boolean} getObject - If true, the onChange function will be called with
 * an object from the choices array instead of the value.
 * @param {string} label - The label of the select input.
 * @param {string} values - The property name of the value in the choices objects.
 * @param {string} texts - The property name of the text in the choices objects.
 * @param {string} className - The class name of the MDBSelect component.
 * @param {string} inputClassName - The class name of the MDBSelectInput component.
 * @param {boolean} disableAll - If true, all options will be disabled.
 * @param {boolean} multiple - If true, the select will allow multiple values to be
 * selected.
 * @param {boolean} disabledAllExceptSelected - If true, all options except the
 * selected one will be disabled.
 * @param {object} disableByKey - An object with keys and values that will be used
 * to disable options. If the value of an option matches the value of a key in
 * this object, the option will be disabled.
 * @param {boolean} disableSearch - If true, the search bar will be disabled.
 */
export default function CustomSelect({
  choices = [],
  preValue = "", //for string
  preValues = [], //for array
  onChange = () => {},
  getObject = false,
  label,
  values,
  texts,
  _key = "",
  className = "",
  inputClassName = "",
  disableAll = false,
  hideLabel = false,
  multiple = false,
  disabledAllExceptSelected = false,
  disableByKey = {},
  disableSearch = false,
}) {
  const handleChoiceDisabling = (value, obj) => {
    if (disableAll) return true;
    if (disabledAllExceptSelected && value !== preValue) return true;

    if (Object.keys(disableByKey).length) {
      return Object.entries(disableByKey).some(
        ([key, val]) => obj[key] === val
      );
    }

    return false;
  };

  const handleSearchDisabling = () => !disableSearch && choices.length > 9;

  const handleSelection = (array) => {
    if (multiple) {
      const selectedItems = getObject
        ? choices.filter((c) => array.includes(String(c[values] || c)))
        : array;
      return onChange(selectedItems);
    }

    const selectedItem = getObject
      ? choices.find(
          (choice) => String(choice[values] || choice) === String(array[0])
        )
      : array[0];

    onChange(selectedItem);
  };

  const handleChecked = (value) => {
    if (multiple) {
      return preValues.includes(value);
    }
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
        {choices.map((choice, index) => {
          const value = String(choice[values] || choice);
          const text = choice[texts] || choice;

          return (
            <MDBSelectOption
              id={`${label}-${value}`}
              disabled={handleChoiceDisabling(value, choice)}
              checked={
                preValue || preValues.length > 0 ? handleChecked(value) : false
              }
              key={`${label}-${index}`}
              value={value || "--"}
            >
              {text || "--"}
            </MDBSelectOption>
          );
        })}
      </MDBSelectOptions>
    </MDBSelect>
  );
}
