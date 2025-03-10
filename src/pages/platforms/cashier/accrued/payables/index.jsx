import React from "react";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import CardBody from "./body";
import PayablesModal from "./modal/payables";
import PaymentsModal from "./modal/payments";

export default function Payables() {
  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "750px" }}>
        <TopHeader />
        <MDBCardBody>
          <CardBody />
        </MDBCardBody>
      </MDBCard>
      {/* Modal for Payables */}
      <PayablesModal />
      {/* Modal for Payments */}
      <PaymentsModal />
    </MDBAnimation>
  );
}
