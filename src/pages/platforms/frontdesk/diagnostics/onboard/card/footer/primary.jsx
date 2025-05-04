import React from "react";
import { useDispatch } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { SetSELECTED } from "../../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";

const PrimaryFooter = ({ deal }) => {
  const dispatch = useDispatch();

  const preAnalytical = async (deal) => {
    console.log("preAnalytical", deal);
  };

  return (
    <>
      <MDBBtnGroup className="sales-card-footer w-100 d-flex flex-row">
        <MDBBtn
          type="button"
          onClick={() => preAnalytical(deal)}
          title="Pre-Analytical Supply Dispense"
          className="m-0 "
          size="sm"
          color="primary"
        >
          <MDBIcon icon="cog" spin />
        </MDBBtn>
        <MDBBtn
          type="button"
          onClick={() => dispatch(SetSELECTED(deal))}
          className="m-0 "
          title="Generate Task"
          size="sm"
          color="primary"
        >
          <MDBIcon icon="user-injured" />
        </MDBBtn>
      </MDBBtnGroup>
    </>
  );
};

export default PrimaryFooter;
