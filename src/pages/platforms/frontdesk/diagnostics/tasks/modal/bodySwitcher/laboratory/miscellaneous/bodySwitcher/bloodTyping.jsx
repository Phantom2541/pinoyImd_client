import React from "react";
import { MDBRow, MDBCol } from "mdbreact";

const colors = {
  0: "warning",
  1: "danger",
  2: "primary",
};

const types = ["A", "B", "O", "AB"];

export default function BloodTyping({ task, setTask }) {
  const { results = { bt: null, rh: null } } = task;

  const handleSelectChange = (name, value) => {
    setTask({ ...task, results: { ...results, [name]: value } });
  };

  return (
    <MDBRow>
      {/* Blood Type */}
      <MDBCol md="6">
        <label className="font-weight-bold">Blood Type</label>
        <div>
          {types.map((type, index) => (
            <div className="form-check" key={`bt-${index}`}>
              <input
                className={`form-check-input text-${colors[index]}`}
                type="radio"
                name="bloodType"
                id={`bt-${index}`}
                value={index}
                checked={results.bt === index}
                onChange={() => handleSelectChange("bt", index)}
              />
              <label className="form-check-label" htmlFor={`bt-${index}`}>
                {type}
              </label>
            </div>
          ))}
        </div>
      </MDBCol>

      {/* RH Factor */}
      <MDBCol md="6">
        <label className="font-weight-bold">RH Factor</label>
        <div>
          {[
            { label: "NEGATIVE", value: 0 },
            { label: "POSITIVE", value: 1 },
          ].map(({ label, value }) => (
            <div className="form-check" key={`rh-${value}`}>
              <input
                className={`form-check-input ${
                  value === 1 ? "text-danger" : ""
                }`}
                type="radio"
                name="rhFactor"
                id={`rh-${value}`}
                value={value}
                checked={results.rh === value}
                onChange={() => handleSelectChange("rh", value)}
              />
              <label className="form-check-label" htmlFor={`rh-${value}`}>
                {label}
              </label>
            </div>
          ))}
        </div>
      </MDBCol>
    </MDBRow>
  );
}
