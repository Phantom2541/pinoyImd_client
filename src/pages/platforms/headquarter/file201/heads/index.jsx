import React from "react";
import { useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../components/tableLoading";
import Header from "./header.jsx";
import Body from "./body";
// import Modal from "./modal";
// import SignaturePreview from "./signaturePreview";

const Index = () => {
  const { isLoading } = useSelector(({ heads }) => heads);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        </MDBCard>
      </MDBAnimation>
      {/* <Modal 
      // selected={selected}
      // willCreate={willCreate}
      // show={showModal}
      // toggle={toggleModal}
       /> */}
      {/* <SignaturePreview 
      // show={showPreviewSignature}
      // toggle={togglePreviewSignature}
      // selected={selected}
      // setImageErrors={setImageErrors}
       /> */}
    </>
  );
};

export default Index;
