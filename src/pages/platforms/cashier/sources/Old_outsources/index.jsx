import React from "react";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import TableLoading from "../../../../../components/tableLoading";
import CardBody from "./body";
import Footer from "./footer";
import { useSelector } from "react-redux";
export default function Outsources() {
  const { isLoading } = useSelector(({ providers }) => providers);

  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: 600 }}>
        <TopHeader />
        <MDBCardBody>{isLoading ? <TableLoading /> : <CardBody />}</MDBCardBody>
        <Footer />
      </MDBCard>
    </MDBAnimation>
  );
}
