import React from "react";
import Calendar from "./calendar";
import { MDBCard, MDBContainer, MDBAnimation } from "mdbreact";
import Header from "./header";
import "./style.css";

export default function Temperature() {
  return (
    <MDBAnimation type="bounceInDown">
      <MDBContainer className="d-grid" fluid>
        <MDBCard className="pb-3 " narrow>
          <Header />
          <Calendar />
        </MDBCard>
      </MDBContainer>
    </MDBAnimation>
  );
}
