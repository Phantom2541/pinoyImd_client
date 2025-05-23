import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";

import {
  TOGGLE,
  SetSELECTED,
} from "../../../../../../../../services/redux/slices/finance/bookkeeping/remittances";

const Footer = ({ num, item = {}, deals }) => {
  console.log("item", item);

  const { month, year } = useSelector(({ remittances }) => remittances),
    dispatch = useDispatch();
  /**
   * Conditions :
   * 1. is possible once "moment" is present
   * 2. if has deals and passed the "moment"
   */
  const handleOpening = () => {
    const localStart = new Date(year, month - 1, num);
    localStart.setHours(0, 0, 0, 0);
    if (deals.length === 0 && localStart < new Date()) return;
    dispatch(TOGGLE({ key: "open", value: num, seleted: item }));
  };
  const handleCensus = () =>
    dispatch(SetSELECTED({ key: "census", value: item, deals }));
  const handleClose = () =>
    dispatch(SetSELECTED({ key: "close", value: item }));
  const { opening, sales: gross, collector } = item;

  return (
    <MDBBtnGroup className="sales-card-footer w-100">
      <MDBBtn
        type="button"
        className="m-0"
        size="sm"
        color={!opening ? "primary" : "danger"}
        disabled={!!opening && Object.keys(opening).length > 0}
        // disabled={!opening}
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
