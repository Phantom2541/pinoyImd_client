import React from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBProgress,
  MDBIcon,
} from "mdbreact";

const Purchases = () => {
  return (
    <MDBCol xl="3" md="6" className="mb-4">
      <MDBCard>
        <MDBCardHeader color="warning-color">Monthly Purchases</MDBCardHeader>
        <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
          <MDBIcon icon="long-arrow-alt-up" className="blue-text mr-3" />$ 2000
        </h6>
        <MDBCardBody>
          <MDBProgress value={45} barClassName="grey darken-2" />
          <p className="font-small grey-text">Better than last week (25%)</p>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Purchases;
