import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  VOUCHERS,
  RESET,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ deals }) => deals),
    [services, setServices] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        VOUCHERS({
          token,
          key: {
            key: "services",
            type: "accrued",
            branchId: activePlatform?.branchId,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    if (filtered) setServices(filtered);
  }, [filtered]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {services.length} Services
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center"></div>
      </div>
    </MDBView>
  );
};

export default Header;
