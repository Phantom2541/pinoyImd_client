import React from "react";
import { MDBRow, MDBCol, MDBCard, MDBContainer } from "mdbreact";
import ProfileImage from "./image";
import Account from "./account";

export default function Profile() {
  return (
    <MDBContainer fluid>
      <MDBRow>
        <ProfileImage />
        <MDBCol lg="9">
          <MDBCard narrow>
            <Account />
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
