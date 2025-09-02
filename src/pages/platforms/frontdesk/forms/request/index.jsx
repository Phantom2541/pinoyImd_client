import React from "react";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import "./requestForm.css"; // import the css

export default function RequestForm() {
  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3 mt-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>
            <Body />
          </MDBCardBody>
        </MDBCard>
      </MDBAnimation>
    </>
  );
}
