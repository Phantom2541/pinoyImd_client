import React from "react";
import { MDBAnimation, MDBCard } from "mdbreact";

import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
import TableLoading from "../../../../../components/tableLoading";
import { useSelector } from "react-redux";

const Index = () => {
  const { isLoading } = useSelector(({ deals }) => deals);
  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3">
        <Header />
        {isLoading ? <TableLoading /> : <Body />}
        <Footer />
      </MDBCard>
    </MDBAnimation>
  );
};

export default Index;
