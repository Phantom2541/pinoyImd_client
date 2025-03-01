import React from "react";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";

import Body from "./body";
import Header from "./header";
import Footer from "./footer";
import TableLoading from "../../../components/tableLoading";

const Index = () => {
  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
      </MDBCard>
    </MDBAnimation>
  );
};

export default Index;
