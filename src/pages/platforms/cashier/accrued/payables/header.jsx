import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  RESET,
  BROWSE,
  SetPAYABLES,
} from "../../../../../services/redux/slices/finance/journals/payables";
import {
  BROWSE as PROVIDERS,
  RESET as PROVIDERRESET,
} from "../../../../../services/redux/slices/assets/providers";
// import { SearchUser } from "../../../../../components/searchables";
export default function TopHeader() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered, message, isSuccess } = useSelector(({ payables }) => payables),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          key: {
            branch: activePlatform?.branchId,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
          },
        })
      );
      dispatch(
        PROVIDERS({
          token,
          key: { clients: activePlatform?.branchId, category: "utilities" },
        })
      );
    }
    return () => {
      dispatch(RESET());
      dispatch(PROVIDERRESET());
    };
  }, [token, activePlatform, dispatch]);

  useEffect(() => {
    message &&
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Payables
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <MDBBtn
            size="sm"
            className="px-3"
            rounded
            color="Secondary"
            onClick={() => {
              dispatch(SetPAYABLES());
            }}
          >
            <MDBIcon icon="plus" />
          </MDBBtn>
        </div>
      </div>
    </MDBView>
  );
}
