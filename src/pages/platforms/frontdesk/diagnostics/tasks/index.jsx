import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBCard, MDBCardBody } from "mdbreact";
import DealCollapse from "./collapse";
import Header from "./headers";
import Footer from "./footer";
import TableLoading from "../../../../../components/tableLoading";

/**
 * For refrences to the following deals
 */
import {
  PREFERENCES,
  HEADS,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import ResultEntry from "./modal";

export default function Tasks() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { message, isSuccess, isLoading } = useSelector(({ deals }) => deals),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(PREFERENCES({ token, branchId: activePlatform?.branchId }));
      dispatch(HEADS({ token, branchId: activePlatform?.branchId }));
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
