import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBContainer, MDBCard, MDBCardBody } from "mdbreact";
import {
  BROWSE,
  SetPREFERENCES,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";

import Header from "./header";
import Body from "./body";
import TableLoading from "../../../../../components/tableLoading";

export default function Diagnostics() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  useEffect(() => {
    const prefData = localStorage.getItem("preferences");
    if (prefData) {
      dispatch(SetPREFERENCES(JSON.parse(prefData)));
    } else if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          branchId: activePlatform.branchId,
        })
      );
    }

    return () => {
      dispatch(PREFRESET());
    };
  }, [token, dispatch, activePlatform]);

  return (
    <MDBContainer fluid>
      <MDBCard narrow>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
