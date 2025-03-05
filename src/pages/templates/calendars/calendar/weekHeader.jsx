import React from "react";

const WeekHeader = () => {
  return (
    <div className="pos-ledger-calendar-weeks">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  );
};

export default WeekHeader;
