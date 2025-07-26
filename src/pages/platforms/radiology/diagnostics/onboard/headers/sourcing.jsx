import React from "react";
import { useSelector } from "react-redux";
const choices = ["All", "Inhouse", "Insource", "Outsource"];

const Sourcing = ({ onChange, view }) => {
  const { isLoading } = useSelector(({ sales }) => sales);

  const handleChange = (value) => onChange(value);

  return (
    <div className="d-flex align-items-center">
      <select
        disabled={isLoading}
        value={view}
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

export default Sourcing;
