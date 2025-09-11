import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";

import TableLoading from "../../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal";

export default function Menus() {
  const { isLoading } = useSelector(({ clinicMenus }) => clinicMenus);

  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
        <Modal />
      </MDBCard>
    </MDBAnimation>
  );
}
