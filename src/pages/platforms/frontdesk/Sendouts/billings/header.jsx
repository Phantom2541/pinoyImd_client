import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { OUTSOURCES } from "../../../../../services/redux/slices/commerce/pos/services/deals";

const Header = () => {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { filtered, month, year } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && auth?.activePlatform?.branchId) {
      dispatch(
        OUTSOURCES({
          token,
          keys: {
            cashierId: auth._id,
            branchId: activePlatform?.branchId,
            month,
            year,
          },
        })
      );
    }
  }, [dispatch, token, auth, activePlatform, month, year]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered?.length} Billing
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">xx</div>
      </div>
    </MDBView>
  );
};

export default Header;
