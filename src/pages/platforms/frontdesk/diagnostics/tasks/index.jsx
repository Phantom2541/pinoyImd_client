import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBCard, MDBCardBody } from "mdbreact";
import DealCollapse from "./collapse";
import Header from "./header";
import Footer from "./footer";
import TableLoading from "../../../../../components/tableLoading";

/**
 * For refrences to the following deals
 */
import {
  HEADS,
  SetHEADS,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import {
  BROWSE,
  SetPREFERENCES,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";
import {
  BROWSE as PHYSICIANS,
  RESET as PHYRESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import ResultEntry from "./modal";

export default function Tasks() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { message, isSuccess } = useSelector(({ deals }) => deals),
    { isLoading } = useSelector(({ validator }) => validator),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // references
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

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  return (
    <MDBCard narrow>
      <Header />
      <MDBCardBody className="pb-0">
        {isLoading ? <TableLoading /> : <DealCollapse />}
      </MDBCardBody>
      <Footer />
      <ResultEntry />
    </MDBCard>
  );
}
