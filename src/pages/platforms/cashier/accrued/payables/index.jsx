import React from "react";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import Body from "./body";
import PayablesModal from "./modal/payables";
import PaymentsModal from "./modal/payments";
import Footer from "./footer";

export default function Payables() {
  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <TopHeader />
        <MDBCardBody>
          <Body />
        </MDBCardBody>
        <Footer />
      </MDBCard>
      {/* Modal for Payables */}
      <PayablesModal />
      {/* Modal for Payments */}
      <PaymentsModal />
    </MDBAnimation>
  );
}
