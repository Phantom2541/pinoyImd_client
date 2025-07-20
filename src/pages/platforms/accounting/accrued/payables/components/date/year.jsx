import React from "react";
const Year = ({ year, setYear }) => {
  return (
    <select
      className="browser-default custom-select"
      style={{ width: "115px", marginRight: "20px" }}
      value={year}
      onChange={(event) => setYear(parseInt(event.target.value))}
    >
      {Array.from({ length: 9 }, (index, i) => (
        <option key={i + 2022} value={i + 2022}>
          {i + 2022}
        </option>
      ))}
    </select>
  );
};

export default Year;
