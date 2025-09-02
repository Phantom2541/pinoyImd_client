import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBContainer, MDBCard, MDBCardBody } from "mdbreact";
import {
  BROWSE,
  SetPREFERENCES,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";

import {
  HEADS,
  SetHEADS,
  SetByGroup,
  SetByStatus,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import {
  BROWSE as PHYSICIANS,
  RESET as PHYRESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import Header from "./header";
import Body from "./body";
import TableLoading from "../../../../../components/tableLoading";

export default function Tasks() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const branchId = activePlatform.branchId;

      const prefData = localStorage.getItem(`preferences`);
      const headsData = localStorage.getItem(`heads-${branchId}`);

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

      if (headsData) {
        dispatch(SetHEADS(JSON.parse(headsData)));
      } else {
        dispatch(HEADS({ token, branchId })).then((res) => {
          if (res?.payload) {
            localStorage.setItem(
              `heads-${branchId}`,
              JSON.stringify(res.payload?.payload)
            );
          }
        });
      }

      dispatch(PHYSICIANS({ token, branchId })).then((res) => {
        if (res?.payload) {
          localStorage.setItem(
            `physicians`,
            JSON.stringify(res.payload?.payload)
          );
        }
      });

      return () => {
        dispatch(PREFRESET());
        dispatch(PHYRESET());
      };
    }
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    dispatch(SetByGroup("all"));
    dispatch(SetByStatus("all"));
  }, [dispatch]);

  return (
    <MDBContainer fluid>
      <MDBCard narrow>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
