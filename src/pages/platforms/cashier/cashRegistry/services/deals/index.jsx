import React from "react";
import { useSelector } from "react-redux";
import CashRegister from "../cashierOld/pos";
import { MDBCard, MDBCardBody, MDBContainer } from "mdbreact";
import Header from "./list/header";
import Body from "./list/body";
import Footer from "./list/footer";
import TableLoading from "../../../../../../components/tableLoading";
import { Closing, Payments, Vouchers } from "./summary";

export default function Deals() {
  const { isLoading } = useSelector(({ deals }) => deals);
  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <MDBCard narrow style={{ minHeight: "75vh" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
        <CashRegister />
      </div>
      <div style={{ width: "300px", marginLeft: "10px" }}>
        <Payments />
        <Vouchers />
        <Closing />
      </div>
    </MDBContainer>
  );
}
