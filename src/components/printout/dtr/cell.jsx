import React from "react";

export default function Cell({ item }) {
  const isSunday = item.day === "Sunday";

  return (
    <tr className={isSunday ? "sunday" : ""}>
      <td>{item.date}</td>
      <td>{item.day}</td>
      <td>{item.amIn || "-"}</td>
      <td>{item.amOut || "-"}</td>
      <td>{item.pmIn || "-"}</td>
      <td>{item.pmOut || "-"}</td>
      <td>{item.status || "-"}</td>
    </tr>
  );
}
