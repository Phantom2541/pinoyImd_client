import React from "react";
// import { useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";

const Header = () => {
  // const { patient, tests } = useSelector(({ requestForm }) => requestForm);

  const handlePrintOut = () => {
    window.open(
      "/printout/laboratoryRequestForm",
      "RequestForm",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  return (
    <div className="d-flex justify-content-center">
      <MDBBtn
        size="sm"
        rounded
        color="info"
        onClick={handlePrintOut}
        className="no-print"
      >
        <MDBIcon icon="print" />
      </MDBBtn>
    </div>
  );
};

export default Header;
