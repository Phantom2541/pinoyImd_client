import { MDBRow, MDBCol, MDBCard, MDBContainer } from "mdbreact";
import ProfileImage from "./userPhoto";
import SignatureImage from "./userSign";
import Account from "./account";

export default function Profile() {
  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol lg="3">
          <div className="d-flex flex-column" style={{ gap: "25px" }}>
            <ProfileImage />
            <SignatureImage />
          </div>
        </MDBCol>
        <MDBCol lg="9">
          <MDBCard narrow>
            <Account />
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
