import React from "react";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import PayablesModal from "./modal/payables";
import PaymentsModal from "./modal/payments";
import Footer from "./footer";

export default function Payables() {
  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>
            <Body />
          </MDBCardBody>
          <Footer />
        </MDBCard>
        <PayablesModal />
        <PaymentsModal />
      </MDBAnimation>
    </>
  );
}
