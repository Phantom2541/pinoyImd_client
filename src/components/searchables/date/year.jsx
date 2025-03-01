import React, { useState } from "react";
const Year = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const handleChange = (e) => {
    setYear(Number(e.target.value));
  };

  return (
    <select
      className="browser-default custom-select"
      value={year}
      onChange={handleChange}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <option key={i + 2022} value={i + 2022}>
          {i + 2022}
        </option>
      ))}
    </select>
  );
};

export default Year;
