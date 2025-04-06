import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBContainer, MDBCard, MDBCardHeader, MDBCardBody } from "mdbreact";
import {
  BROWSE,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";

import Header from "./header";
import Body from "./body";

export default function Tasks() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    [patient, setPatient] = useState({}),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
    }

    return () => {
      dispatch(PREFRESET());
    };
  }, [token, dispatch, activePlatform]);

  return (
    <MDBContainer fluid>
      <MDBCard narrow>
        <Header setPatient={setPatient} patient={patient} />
        <MDBCardBody>
          <Body patient={patient} />
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
