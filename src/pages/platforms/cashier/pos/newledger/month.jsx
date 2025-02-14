import React from "react";

const Month = ({ month, handleMonth }) => {
  return (
    <select
      value={month}
      className="form-select form-control"
      onChange={(e) => handleMonth(Number(e.target.value))}
    >
      <option value="0">Month</option>
      <option value="1">January</option>
      <option value="2">Februay</option>
      <option value="3">March</option>
      <option value="4">April</option>
      <option value="5">May</option>
      <option value="6">June</option>
      <option value="7">July</option>
      <option value="8">August</option>
      <option value="9">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
  );
};

export default Month;
