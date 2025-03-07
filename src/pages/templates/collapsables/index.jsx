import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";

import TableLoading from "../../../components/tableLoading";
import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
const Collapsable = () => {
  const { isLoading } = useSelector(({ services }) => services);

  return (
    <>
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
      </MDBCard>
    </>
  );
};

export default Collapsable;
