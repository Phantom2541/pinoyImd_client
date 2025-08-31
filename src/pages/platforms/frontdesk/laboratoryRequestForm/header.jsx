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
    <div style={{ position: "relative" }}>
      <MDBView
        cascade
        className="gradient-card-header blue-gradient py-2 d-flex justify-content-between align-items-center"
      >
        {/* Invisible placeholder to keep print button on right */}
        <div style={{ width: "80px" }}></div>

        {/* Center: Title */}
        <div
          className="white-text text-nowrap text-center"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span className="h3 m-0 font-weight-bold">
            Laboratory Request Form
          </span>
        </div>

        {/* Right side: Print button */}
        <MDBBtn
          size="sm"
          rounded
          color="info"
          onClick={handlePrintOut}
          className="no-print"
        >
          <MDBIcon icon="print" />
        </MDBBtn>
      </MDBView>
    </div>
  );
};

export default Header;
