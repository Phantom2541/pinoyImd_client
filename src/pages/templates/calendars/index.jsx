import React from "react";
import Calendar from "./calendar";
import { MDBCard, MDBContainer } from "mdbreact";
import Header from "./header";
import "./style.css";

export default function Ledger() {
  return (
    <MDBContainer className="d-grid" fluid>
      <MDBCard className="pb-3 " narrow>
        <Header />
        <Calendar />
      </MDBCard>
    </MDBContainer>
  );
}
