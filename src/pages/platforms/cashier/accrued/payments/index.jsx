import React from "react";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import Body from "./components/collapse";
export default function Payables() {
  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <TopHeader />
        <MDBCardBody>
          <Body />
        </MDBCardBody>
      </MDBCard>
    </MDBAnimation>
  );
}
