import React from "react";

const Cell = ({ item }) => {
  return (
    <tr
      style={{
        backgroundColor: item.isSunday ? "#ffe6e6" : "white",
        textAlign: "center",
      }}
    >
      <td>{item.date}</td>
      <td>{item.day}</td>
      <td>{item.amIn || "-"}</td>
      <td>{item.amOut || "-"}</td>
      <td>{item.pmIn || "-"}</td>
      <td>{item.pmOut || "-"}</td>
      <td>{item.status || "-"}</td>
    </tr>
  );
};

export default Cell;
