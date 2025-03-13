import React from "react";
import { MDBCard, MDBCardBody, MDBContainer } from "mdbreact";
import CardHeader from "./header";
import CardTables from "./body";
import Modal from "./modal";
import Chart from "./chart";
import Footer from "./footer";

const Controls = () => {
  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <Chart />
      </div>
      <div style={{ width: "350px", marginLeft: "10px" }}>
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <CardHeader />
          <MDBCardBody>
            <CardTables />
          </MDBCardBody>
          <Footer />
        </MDBCard>
      </div>
      <Modal />
    </MDBContainer>
  );
};

export default Controls;
