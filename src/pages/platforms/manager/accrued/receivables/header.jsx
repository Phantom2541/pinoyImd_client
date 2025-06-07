import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/finance/journals/soa";
import Search from "../../../../../components/searchables/search";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ deals }) => deals),
    [services, setServices] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          keys: {
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
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          Account Receivable List
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
