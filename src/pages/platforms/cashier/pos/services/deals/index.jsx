import React from "react";
import { useSelector } from "react-redux";
import CashRegister from "../cashierOld/pos";
import { MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import TableLoading from "../../../../../../components/tableLoading";
import { Payments, Vouchers } from "./summary";

export default function Deals() {
  const { isLoading } = useSelector(({ deals }) => deals);
  return (
    <div className="d-flex" style={{ height: "100vh", gap: "10px" }}>
      <div className="bg-white py-1 rounded flex-1 ml-2 px-2">
        <MDBCard narrow>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
        <CashRegister />
      </div>
      <div style={{ width: "300px", marginLeft: "10px" }}>
        <Payments />
        <Vouchers />
      </div>
    </div>
  );
}
