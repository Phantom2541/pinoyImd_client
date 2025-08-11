import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Modal from "./modal";

const Catalogs = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(({ products }) => products);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        </MDBCard>
      </MDBAnimation>
      <Modal />
    </>
  );
};

export default Catalogs;
