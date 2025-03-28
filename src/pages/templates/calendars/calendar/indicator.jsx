import React from "react";

const Indicator = ({ num, week, isFuture, isToday }) => {
  return (
    <>
      {num && (
        <span className="text-left">
          <small
            className={`${isFuture ? "future" : ""} 
                        ${week === "Sun" ? "sunday" : ""} 
                        ${isToday ? "today" : ""}`} // text-green-500
          >
            {num}
          </small>
        </span>
      )}
    </>
  );
};

export default Indicator;
