import React from "react";
import { useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import TableLoading from "../../../../../components/tableLoading";
// import Footer from "./footer";

const Sendouts = () => {
  const { isLoading } = useSelector(({ deals }) => deals);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        </MDBCard>
      </MDBAnimation>
    </>
  );
};

export default Sendouts;
