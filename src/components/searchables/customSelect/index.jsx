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

    if (!!Object.keys(disableByKey).length) {
      for (const key in disableByKey) {
        if (obj[key] === disableByKey[key]) return true;
      }
    }

    return false;
  };

  const handleSearchDisabling = () => {
    if (disableSearch) return false;

    return choices.length > 9;
  };

  return (
    <MDBSelect
      label={!hideLabel && label}
      getValue={(array) => {
        if (multiple)
          return onChange(
            getObject ? choices.filter((c) => array.includes(c[values])) : array
          );

        onChange(
          getObject
            ? choices.find((choice) => choice[values] === array[0])
            : array[0]
        );
      }}
      className={`${className}`}
      multiple={multiple}
      color="primary"
    >
      <MDBSelectInput className={`${inputClassName}`} selected={preValue} />
      <MDBSelectOptions search={handleSearchDisabling()}>
        {choices.map((choice, index) => {
          const value = String(choice[values] || choice),
            text = choice[texts] || choice;

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
