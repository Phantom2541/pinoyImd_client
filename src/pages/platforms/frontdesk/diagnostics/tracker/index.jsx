import React, { useEffect, useState } from "react";
import Header from "./header";
import Body from "./body";
import { TRACKER } from "../../../../../services/redux/slices/commerce/sales";
import { useDispatch, useSelector } from "react-redux";
import { MDBContainer } from "mdbreact";
import {
  BROWSE,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/results/preferences";

export default function Tasks() {
  const [patient, setPatient] = useState({}),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {    
    if (patient?._id && activePlatform?.branchId) {
      dispatch(
        TRACKER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            customerId: patient._id,
          },
        })
      );
    }
  }, [patient, activePlatform, dispatch, token]);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
    }

    return () => {
      dispatch(PREFRESET());
    };
  }, [token, dispatch, activePlatform]);

  const selectPatient = (user) => {    
    setPatient(user);
  };

  return (
    <MDBContainer fluid>
      <Header
        selectPatient={selectPatient}
        patient={patient}
      />
      <Body patient={patient} />
    </MDBContainer>
  );
}
