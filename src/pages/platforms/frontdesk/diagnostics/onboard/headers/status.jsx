import React from "react";
const choices = ["All", "onboarded", "on process"];

const Status = ({ setStatus }) => {
  const handleChange = (value) => setStatus(value);

  return (
    <div className="d-flex align-items-center">
      <select
        onChange={({ target }) => handleChange(target.value)}
        className="form-control w-auto cursor-pointer pr-5"
      >
        {choices?.map((choice, index) => {
          return (
            <option
              value={choice}
              key={`choices${index}`}
              className="text-capitalize"
            >
              {choice}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Status;
