import React from "react";
import { MDBContainer } from "mdbreact";
import Chart from "./chart";

const Controls = () => {
  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <Chart />
      </div>
    </MDBContainer>
  );
};

export default Controls;
