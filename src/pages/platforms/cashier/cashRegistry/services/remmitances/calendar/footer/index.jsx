import React from "react";
import { useDispatch } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";

import { TOGGLE } from "../../../../../../../../services/redux/slices/finance/bookkeeping/remittances";

const Footer = ({ num }) => {
  const dispatch = useDispatch();
  const handleOpening = () => dispatch(TOGGLE({ key: "open", value: num }));
  const handleCensus = () => dispatch(TOGGLE({ key: "census", value: num }));
  const handleClose = () => dispatch(TOGGLE({ key: "close", value: num }));

  return (
    <MDBBtnGroup className="sales-card-footer w-100">
      <MDBBtn
        type="button"
        className="m-0"
        size="sm"
        color="primary"
        title="Open Cash Register"
        onClick={() => handleOpening()}
      >
        <MDBIcon icon="money-bill-wave" />
      </MDBBtn>
      <MDBBtn
        type="button"
        className="m-0 "
        size="sm"
        color="primary"
        title="Census"
        onClick={() => handleCensus()}
      >
        <MDBIcon icon="bars" />
      </MDBBtn>
      <MDBBtn
        type="button"
        className="m-0 "
        size="sm"
        color="primary"
        title="Close Cash Register"
        onClick={() => handleClose()}
      >
        <MDBIcon icon="exchange-alt" spin />
      </MDBBtn>
    </MDBBtnGroup>
  );
};

export default Footer;
