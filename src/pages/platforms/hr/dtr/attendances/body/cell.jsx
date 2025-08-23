import React from "react";

const Cell = ({ item }) => {
  return (
    <tr
      style={{
        backgroundColor: item.isSunday ? "#ffe6e6" : "white",
        textAlign: "center",
      }}
    >
      {/* Date */}
      <td>{item.date}</td>
      {/* Day */}
      <td>{item.day}</td>
      {/* AM In */}
      <td>{item.amIn || "-"}</td>
      {/* AM Out */}
      <td>{item.amOut || "-"}</td>
      {/* PM In */}
      <td>{item.pmIn || "-"}</td>
      {/* PM Out */}
      <td>{item.pmOut || "-"}</td>
      {/* Status */}
      <td>{item.status || "-"}</td>
    </tr>
  );
};

export default Cell;
