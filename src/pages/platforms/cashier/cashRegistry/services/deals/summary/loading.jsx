import React from "react";
import { MDBAnimation, MDBProgress } from "mdbreact";

const SummaryLoading = ({ rowCount = 5 }) => {
  return (
    <>
      {new Array(rowCount).fill("").map((_, index) => (
        <MDBAnimation
          type="flash"
          infinite
          className="mt-2"
          delay={`${2 + index}00ms`}
          duration="3000ms"
        >
          <MDBProgress
            color="light"
            value={3000}
            id="progress-table"
            key={index}
          ></MDBProgress>
        </MDBAnimation>
      ))}
    </>
  );
};

export default SummaryLoading;
