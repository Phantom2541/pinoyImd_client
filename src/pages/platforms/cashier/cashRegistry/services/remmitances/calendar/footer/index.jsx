import React from "react";
import { useDispatch } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";

import {
  TOGGLE,
  SetSELECTED,
} from "../../../../../../../../services/redux/slices/finance/bookkeeping/remittances";

const Footer = ({ num, item = {} }) => {
  const dispatch = useDispatch();
  const handleOpening = () => dispatch(TOGGLE({ key: "open", value: num }));
  const handleCensus = () =>
    dispatch(SetSELECTED({ key: "census", value: item }));
  const handleClose = () =>
    dispatch(SetSELECTED({ key: "close", value: item }));
  const { opening, gross, collector } = item;

  return (
    <MDBBtnGroup className="sales-card-footer w-100">
      <MDBBtn
        type="button"
        className="m-0"
        size="sm"
        color={opening ? "danger" : "primary"}
        disabled={!!opening}
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
        disabled={!opening}
      >
        <MDBIcon icon="bars" />
      </MDBBtn>
      <MDBBtn
        type="button"
        className="m-0 "
        size="sm"
        color={gross < 0 ? "danger" : "primary"}
        title="Close Cash Register, to unlock, declaire a census"
        onClick={() => handleClose()}
        disabled={!gross || collector}
      >
        <MDBIcon icon="exchange-alt" />
      </MDBBtn>
    </MDBBtnGroup>
  );
};

export default Footer;
