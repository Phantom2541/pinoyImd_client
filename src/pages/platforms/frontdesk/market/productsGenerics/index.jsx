import React from "react";
import { useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal";

const Index = () => {
  // const services = useSelector((state) => state.services);
  // const isLoading = services.isLoading;
  // const isSuccess = services.isSuccess;
  // const isError = services.isError;

  const { isLoading } = useSelector(({ services }) => services);

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
    </>
  );
};

export default Index;
