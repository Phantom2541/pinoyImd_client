import React from "react";

const Indicator = ({ num, week, isFuture }) => {
  return (
    <>
      {num && (
        <span className={` text-left `}>
          <small
            className={`${isFuture ? "future" : ""} ${
              week === "Sun" ? "sunday" : ""
            }`}
          >
            {num}
          </small>
        </span>
      )}
    </>
  );
};

export default Indicator;
