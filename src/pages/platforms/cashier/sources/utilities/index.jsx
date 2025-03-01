import React from "react";
import { MDBCard, MDBCardBody } from "mdbreact";

import TopHeader from "./header";
import TableLoading from "../../../../../components/tableLoading";
import CardBody from "./body";
import { useSelector } from "react-redux";
export default function Utilities() {
  const { isLoading } = useSelector(({ providers }) => providers);

  return (
    <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
      <TopHeader />
      <MDBCardBody>{isLoading ? <TableLoading /> : <CardBody />}</MDBCardBody>
    </MDBCard>
  );
}
