import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
} from "mdbreact";

export default function ExportToExcel({ show, toggle }) {
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <MDBModal isOpen={show} toggle={() => toggle()} backdrop size="md">
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="file-export" className="mr-2" />
        Export menus price list
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <h6>
            Which menu price list would you like to export: In-House,
            Membership, Contract, or HMO?{" "}
          </h6>
          {/* Submit button */}
          <div className="text-center mb-1-half">
            <MDBBtn type="submit" color="info" className="mb-2" rounded>
              Export
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
