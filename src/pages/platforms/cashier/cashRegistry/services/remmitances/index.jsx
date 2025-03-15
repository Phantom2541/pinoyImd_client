import React from "react";
import { MDBCard, MDBContainer } from "mdbreact";
import "./style.css";
import Header from "./header";
import Calendar from "./calendar";

export default function Remmitances() {
  return (
    <MDBContainer className="d-grid" fluid>
      <MDBCard className="pb-3" narrow>
        <Header />
        <Calendar />
      </MDBCard>
    </MDBContainer>
  );
}
