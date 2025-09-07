import React from "react";
import { MDBAnimation } from "mdbreact";
import Body from "./body";

export default function Clearance() {
  return (
    <div>
      <MDBAnimation type="bounceInDown">
        <Body />
      </MDBAnimation>
    </div>
  );
}
