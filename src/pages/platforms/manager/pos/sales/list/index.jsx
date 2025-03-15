import React from "react";
import { useSelector } from "react-redux";
import { MDBCard } from "mdbreact";

import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import TableLoading from "../../../../../../components/tableLoading";

export default function Sales() {
  const { isLoading } = useSelector(({ deals }) => deals);
  return (
    <>
      <MDBCard>
        <Header />
        {isLoading ? <TableLoading /> : <Body />}
        <Footer />
      </MDBCard>
    </>
  );
}
