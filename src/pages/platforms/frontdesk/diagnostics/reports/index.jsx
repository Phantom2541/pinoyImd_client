import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBContainer } from "mdbreact";
import {
  BROWSE,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/results/preferences";

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
      <Header setPatient={setPatient} patient={patient} />
      <Body patient={patient} />
    </MDBContainer>
  );
}
