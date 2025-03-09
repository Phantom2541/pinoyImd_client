import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import {
  RESET,
  BROWSE,
  SetPAYABLES,
} from "../../../../../services/redux/slices/finance/payables";
import {
  BROWSE as PROVIDERBROWSE,
  RESET as PROVIDERRESET,
} from "../../../../../services/redux/slices/assets/providers";
export default function TopHeader() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          key: {
            branch: activePlatform?.branchId,
          },
        })
      );
      dispatch(
        PROVIDERBROWSE({ token, key: { branch: activePlatform?.branchId } })
      );
    }
    return () => {
      dispatch(RESET());
      dispatch(PROVIDERRESET());
    };
  }, [token, activePlatform, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Payables </span>
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
