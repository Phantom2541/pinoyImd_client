import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";

import TableLoading from "../../../../../../components/tableLoading";
import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
import Modal from "./modal";
import ModalBrand from "./collapse/modal";
const Collapsable = () => {
  const { isLoading } = useSelector(({ generics }) => generics);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <Modal />
      <ModalBrand />
    </>
  );
};

export default Collapsable;
