import React from "react";
const Year = ({ year, handleYear }) => {
  return (
    <select
      name="year"
      value={year}
      className="form-select form-control"
      onChange={(e) => handleYear(Number(e.target.value))}
    >
      <option value="2022">2022</option>
      <option value="2023">2023</option>
      <option value="2024">2024</option>
      <option value="2025">2025</option>
    </select>
  );
};

export default Year;
