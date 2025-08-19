import { MDBCol, MDBInput, MDBRow } from "mdbreact";

const Basic = () => {
  return (
    <MDBRow>
      <MDBCol>
        <MDBInput label="Price" />
      </MDBCol>
      <MDBCol>
        <MDBInput label="Cost" />
      </MDBCol>
      <MDBCol>
        <MDBInput label="Stock" />
      </MDBCol>
    </MDBRow>
  );
};

export default Basic;
