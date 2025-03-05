import React, { useState } from "react";
import Calendar from "./calendar";
import { MDBCard, MDBContainer } from "mdbreact";
import Header from "./header";
import "./style.css";

export default function Ledger() {
  const [show, setShow] = useState(false);

  return (
    <MDBContainer className="d-grid" fluid>
      <MDBCard className="p-3">
        <Header />
        <Calendar />
      </MDBCard>
    </MDBContainer>
  );
}
