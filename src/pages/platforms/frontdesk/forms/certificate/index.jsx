import React from "react";
import { MDBAnimation } from "mdbreact";
import Body from "./body";
import "./reportCertificate.css"; // import the css

export default function MedicalExaminationClearance() {
  return (
    <div>
      <MDBAnimation type="bounceInDown">
        <Body />
      </MDBAnimation>
    </div>
  );
}
