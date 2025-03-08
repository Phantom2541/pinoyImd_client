import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";

import TableLoading from "../../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";

export default function Menus() {
  const { isLoading } = useSelector(({ services }) => services);

  return (
    <MDBAnimation type="slideInLeft">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
      </MDBCard>
    </MDBAnimation>
  );
}
