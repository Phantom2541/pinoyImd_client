import React from "react";
import { MDBCard, MDBRow, MDBCol, MDBBtn, MDBIcon } from "mdbreact";

const Utilities = () => {
  return (
    <MDBCol xl="3" md="6" className="mb-4 mb-r">
      <MDBCard>
        <MDBRow className="mt-3">
          <MDBCol md="5" col="5" className="text-left pl-4">
            <MDBBtn
              tag="a"
              floating
              size="lg"
              color="warning"
              className="ml-4"
              style={{ padding: 0 }}
            >
              <MDBIcon icon="user" size="2x" />
            </MDBBtn>
          </MDBCol>
          <MDBCol md="7" col="7" className="text-right pr-5">
            <h5 className="ml-4 mt-4 mb-2 font-weight-bold">2,976</h5>
            <p className="font-small grey-text">New Users</p>
          </MDBCol>
        </MDBRow>
        <MDBRow className="my-3">
          <MDBCol md="7" col="7" className="text-left pl-4">
            <p className="font-small dark-grey-text font-up ml-4 font-weight-bold">
              Last month
            </p>
          </MDBCol>
          <MDBCol md="5" col="5" className="text-right pr-5">
            <p className="font-small grey-text">145,567</p>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBCol>
  );
};

export default Utilities;
