import React from "react";
import { useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import Body from "./components/collapse";
import TableLoading from "../../../../../components/tableLoading/index.jsx";

export default function Payables() {
  const { isLoading } = useSelector(({ payments }) => payments);
  return (
    <MDBAnimation className="pt-2" type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <TopHeader />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
      </MDBCard>
    </MDBAnimation>
  );
}
