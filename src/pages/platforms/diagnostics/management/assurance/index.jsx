import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "./../../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
// import Modal from "./modal";
// import Footer from "./footer";
const Assurances = () => {
  const { isLoading } = useSelector(({ assurances }) => assurances);

  return (
    <>
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        {/* <Footer /> */}
      </MDBCard>
    </>
  );
};

export default Assurances;
