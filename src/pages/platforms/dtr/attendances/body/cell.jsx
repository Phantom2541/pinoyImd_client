import React from "react";

const Cell = ({ item }) => {
  const {
    date,
    day,
    in: timeIn,
    out: timeOut,
    status,
    isSunday
  } = item;

  return (
    <tr style={{ backgroundColor: isSunday ? "#f8d7da" : "inherit" }}>
      <td style={{ textAlign: "center" }}>{date}</td>
      <td style={{ textAlign: "center" }}>{day}</td>
      <td style={{ textAlign: "center" }}>{timeIn || "-"}</td>
      <td style={{ textAlign: "center" }}>{timeOut || "-"}</td>
      <td style={{ textAlign: "center", textTransform: "capitalize" }}>{status || "-"}</td>
    </tr>
  );
};

export default Cell;
