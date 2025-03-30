import React from "react";
import { MDBAnimation, MDBProgress } from "mdbreact";

const SummaryLoading = ({ rowCount = 5 }) => {
  return (
    <>
      {new Array(rowCount).fill("").map((_, index) => (
        <MDBAnimation
          key={index}
          type="flash"
          infinite
          className="mt-3"
          delay={`${5 + index}00ms`}
          duration="5000ms"
        >
          <MDBProgress
            color="light"
            value={3000}
            animated
            id="progress-table"
            key={index}
          ></MDBProgress>
        </MDBAnimation>
      ))}
    </>
  );
};

export default SummaryLoading;
