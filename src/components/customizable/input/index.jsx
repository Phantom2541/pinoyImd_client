import React, { useEffect } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";
const Input = ({
  className = "form-control",
  formSubmitted = false,
  isSuccess = false,
  _key,
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
        className={className}
        value={selected[_key] || ""}
        onChange={({ target }) => onChange(target.value, _key)}
      />
      <div className="customizable-input-icons mt-2">
        {!formSubmitted ? (
          <MDBIcon
            icon="check"
            onClick={() => handleCheck()}
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
