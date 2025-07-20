import React from "react";

const Indicator = ({ num, week, isFuture, activeCell }) => {
  return (
    <>
      {num && (
        <span className={` text-left `}>
          <small
            className={`${isFuture ? "future" : ""} ${
              week === "Sun" ? "sunday" : ""
            } ${activeCell ? "active" : ""}`}
          >
            {num}
          </small>
        </span>
      )}
    </>
  );
};

export default Indicator;
