import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";

import TableLoading from "../../../../../components/tableLoading";
import Body from "./collapse";
import Header from "./header";
import Footer from "./footer";

const ServicesComponent = () => {
  const { isLoading } = useSelector(({ preferences }) => preferences);

  return (
    <MDBCard narrow>
      <Header />
      <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
      <Footer />
    </MDBCard>
  );
};

export default ServicesComponent;
