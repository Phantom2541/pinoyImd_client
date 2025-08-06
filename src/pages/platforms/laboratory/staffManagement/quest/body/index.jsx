import React from "react";
// import Calendar from "./calendar";
import { MDBCard, MDBContainer, MDBAnimation } from "mdbreact";
import Header from "./header";
import "./style.css";
// summaryRef, summaryBodyRef;
export default function Ledger() {
  return (
    <MDBAnimation type="bounceInDown">
      <MDBContainer className="d-grid" fluid>
        <MDBCard className="pb-3 " narrow>
          <Header />
          {/* <Calendar summaryRef={summaryRef} /> */}
        </MDBCard>
      </MDBContainer>
    </MDBAnimation>
  );
}
