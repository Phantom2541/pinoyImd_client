import React from "react";
import { MDBContainer } from "mdbreact";
import { Payments, Vouchers } from "./summary";
import List from "./list";

export default function Deals() {
  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <List />
      </div>
      <div style={{ width: "300px", marginLeft: "10px" }}>
        <Payments />
        <Vouchers />
      </div>
    </MDBContainer>
  );
}
