import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { VOUCHERS } from "../../../../../services/redux/slices/commerce/pos/services/deals";
const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { filtered, year, month } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token) {
      dispatch(
        VOUCHERS({
          token,
          key: {
            branchId: activePlatform.branchId,
            month,
            year,
            cashierId: auth._id,
          },
        })
      );
    }
  }, [token, dispatch, activePlatform, month, year, auth]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Receivables
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center"></div>
      </div>
    </MDBView>
  );
};

export default Header;
