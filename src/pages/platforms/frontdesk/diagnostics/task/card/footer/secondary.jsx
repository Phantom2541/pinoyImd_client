import React from "react";
import { MDBBtn, MDBBtnGroup } from "mdbreact";

const SecondaryFooter = ({ setEdit, handleUpdate }) => {
  return (
    <MDBBtnGroup className="w-100">
      <MDBBtn
        type="button"
        className="m-0"
        size="sm"
        color="danger"
        onClick={() => setEdit(false)}
      >
        Cancel
      </MDBBtn>
      <MDBBtn
        onClick={handleUpdate}
        type="button"
        className="m-0 "
        size="sm"
        color="primary"
      >
        Submit
      </MDBBtn>
    </MDBBtnGroup>
  );
};

export default SecondaryFooter;
