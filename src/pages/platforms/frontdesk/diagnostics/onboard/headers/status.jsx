import React from "react";
const choices = ["All", "generated", "on process"];

const Status = ({ setStatus, status }) => {
  const handleChange = (value) => setStatus(value);

  return (
    <div className="d-flex align-items-center">
      <select
        onChange={({ target }) => handleChange(target.value)}
        className="form-control w-auto cursor-pointer pr-5"
        value={status}
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
