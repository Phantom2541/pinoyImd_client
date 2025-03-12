import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBCard, MDBCardBody } from "mdbreact";
import TasksCollapse from "./collapse";
import Header from "./headers";
import Footer from "./footer";
import TableLoading from "../../../../../components/tableLoading";

/**
 * For refrences to the following deals
 */
import {
  BROWSE,
  RESET as PREFRESET,
} from "./../../../../../services/redux/slices/diagnostics/laboratory/preferences";
import {
  BROWSE as HEADS,
  RESET as HEADSRESET,
} from "./../../../../../services/redux/slices/assets/persons/heads";
import ResultEntry from "./modal";

export default function Tasks() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    [searchKey, setSearchKey] = useState(""),
    [page, setPage] = useState(1),
    { message, isSuccess, isLoading } = useSelector(({ deals }) => deals),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
      dispatch(HEADS({ token, branchId: activePlatform?.branchId }));
    }

    return () => {
      dispatch(RESET());
      dispatch(PREFRESET());
      dispatch(HEADSRESET());
    };
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

  const resetSearch = () => setSearchKey("");

  return (
    <MDBCard narrow>
      <Header searchKey={searchKey} setSearchKey={setSearchKey} />
      <MDBCardBody className="pb-0">
        {isLoading ? (
          <TableLoading />
        ) : (
          <>
            <TasksCollapse
              page={page}
              resetSearch={resetSearch}
              searchKey={searchKey}
            />
            <Footer page={page} setPage={setPage} />
          </>
        )}
      </MDBCardBody>
      <ResultEntry />
    </MDBCard>
  );
}
