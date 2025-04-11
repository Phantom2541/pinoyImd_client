import React, { useEffect } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";
/**
 * A customizable input component with support for single and multiple selections, search, and more.
 *
 * @param {string} [className="form-control"] - The class name to apply to the input element.
 * @param {boolean} [formSubmitted=false] - Whether the form has been submitted.
 * @param {boolean} [isSuccess=false] - Whether the form has been submitted with success.
 * @param {string} [_key] - The key to use for the value.
 * @param {string} [type="text"] - The type of input.
 * @param {object} [selected={}] - The selected value.
 * @param {function} [onChange=() => {}] - The function to call when the selected value changes.
 * @param {function} [handleCheck=() => {}] - The function to call when the check icon is clicked.
 * @param {function} [handleClose=() => {}] - The function to call when the close icon is clicked.
 */

const Input = ({
  className = "form-control",
  formSubmitted = false,
  isSuccess = false,
  label = "",
  _key, //this key is for value
  type = "text",
  selected = {},
  onChange = () => {},
  handleCheck = () => {},
  handleClose = () => {},
}) => {
  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      handleClose();
    }
  }, [formSubmitted, isSuccess, handleClose]);
  return (
    <div className="d-flex align-items-center customizable-input-container">
      <input
        placeholder={label}
        className={className}
        value={selected?.[_key] || ""}
        type={type}
        onChange={({ target }) => onChange(_key, target.value)}
      />
      <div className="customizable-input-icons mt-2">
        {!formSubmitted ? (
          <MDBIcon
            icon="check"
            onClick={() => handleCheck({ [_key]: selected[_key] })}
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
            }}
          />
        )}
        <MDBIcon
          icon="times"
          onClick={handleClose}
          disabled={formSubmitted}
          className="cursor-pointer"
          style={{ color: "red", fontSize: "1rem" }}
        />
      </div>
    </div>
  );
};

export default Input;
