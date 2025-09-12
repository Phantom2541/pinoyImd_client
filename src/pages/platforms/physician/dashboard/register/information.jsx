import { MDBCol, MDBInput, MDBRow } from "mdbreact";

const Information = () => {
  return (
    <MDBCol md="6">
      <span className="fw-bold">Clinic Information</span>
      <MDBRow>
        <MDBCol>
          <MDBInput label="Title" />
        </MDBCol>
        <MDBCol>
          <MDBInput label="Code" />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <MDBInput label="Specialty" />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <MDBInput label="Description" type="textarea" />
        </MDBCol>
        <MDBCol>
          <MDBInput label="Remarks" type="textarea" />
        </MDBCol>
      </MDBRow>
    </MDBCol>
  );
};

export default Information;
