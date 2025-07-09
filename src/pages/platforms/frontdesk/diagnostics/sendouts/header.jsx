import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { OUTSOURCES } from "../../../../../services/redux/slices/commerce/pos/services/deals";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  useEffect(() => {
    const date = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (token) {
      dispatch(
        OUTSOURCES({
          token,
          keys: {
            branchId: activePlatform?.branchId,
            date,
          },
        })
      );
    }
  }, [token, dispatch, activePlatform, month, year]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-3 mx-4 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          Sendout Services Status
        </span>
      </div>
    </MDBView>
  );
};

export default Header;
