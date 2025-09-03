import React from "react";
import { MDBAnimation } from "mdbreact";
import Body from "./body";

export default function MedicalClearanceForm() {
  return (
    <div>
      <MDBAnimation type="bounceInDown">
        <Body />
      </MDBAnimation>
    </div>
  );
}
