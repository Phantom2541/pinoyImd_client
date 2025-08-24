import React from "react";

// helper function para tanggalin AM/PM at gawing 24-hour format
const formatTime = (timeString) => {
  if (!timeString) return "-";
  const date = new Date(timeString);
  if (isNaN(date)) {
    // fallback: kung plain string lang, alisin lang yung AM/PM text
    return timeString.replace(/AM|PM/gi, "");
  }
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  });
};

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
      <td>{formatTime(item.amIn)}</td>
      <td>{formatTime(item.amOut)}</td>
      <td>{formatTime(item.pmIn)}</td>
      <td>{formatTime(item.pmOut)}</td>
      <td>{item.status || "-"}</td>
    </tr>
  );
};

export default Cell;
