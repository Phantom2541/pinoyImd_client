import React from "react";
const Month = ({ month, setMonth }) => {
  const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <select
      className="browser-default custom-select"
      style={{ width: "100px", marginRight: "10px" }}
      value={month}
      onChange={(event) => setMonth(parseInt(event.target.value))} // Extract the value properly
    >
      <option selected disabled>
        Month
      </option>
      {Months.map((monthName, i) => (
        <option key={i + 1} value={i + 1}>
          {monthName}
        </option>
      ))}
    </select>
  );
};

export default Month;
