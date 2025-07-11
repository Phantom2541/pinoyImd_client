import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/commerce/pos/services/onBoardings";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth); //
  const { filtered, collections } = useSelector(
      ({ onBoardings }) => onBoardings
    ), //
    dispatch = useDispatch();

  useEffect(() => {
    const branchId = activePlatform?.branchId;
    if (token && branchId) {
      dispatch(BROWSE({ token, key: { branchId } }));
    }
  }, [token, activePlatform?.branchId, dispatch]);

  //initial values

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered?.length} onBoarding status
        </span>
      </div>
    </MDBView>
  );
};

export default Header;
