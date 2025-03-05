import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  OUTSOURCE,
} from "../../../../../services/redux/slices/assets/providers";
import SearchProviders from "../../../../../components/searchables/providers";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    // console.log("Outside if");
    if (token && activePlatform?.branchId) {
      dispatch(
        OUTSOURCE({
          token,
          key: {
            clients: activePlatform?.branchId,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Outsources </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <SearchProviders />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
