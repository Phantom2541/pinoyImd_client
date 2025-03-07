import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";

export default function CustomSelect({
  choices = [],
  preValue = "",
  onChange = () => {},
  getObject = false,
  label,
  values,
  texts,
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

  return (
    <MDBSelect
      label={!hideLabel && label}
      getValue={handleSelection}
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
              checked={preValue ? String(value) === String(preValue) : false}
              key={`${label}-${index}`}
              value={value}
            >
              {text}
            </MDBSelectOption>
          );
        })}
      </MDBSelectOptions>
    </MDBSelect>
  );
}
