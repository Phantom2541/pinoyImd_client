import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PAYROLL,
  RESET,
} from "../../../../services/redux/slices/assets/persons/personnels";
// import Modal from "./modal";

import { MDBCard, MDBCardBody } from "mdbreact";
import Body from "./tables";
import Header from "./header";

export default function Payrolls() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    PaySlip = useSelector(({ payments }) => payments.isSuccess),
    dispatch = useDispatch();
  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(PAYROLL({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, PaySlip]);

  return (
    <>
      <MDBCard>
        <Header />
        <MDBCardBody>
          <Body />
        </MDBCardBody>
      </MDBCard>
      {/* <Modal /> */}
    </>
  );
}
