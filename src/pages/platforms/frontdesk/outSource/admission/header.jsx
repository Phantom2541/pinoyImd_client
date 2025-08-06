import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/commerce/pos/services/admission";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth); //get the max page
  const { collections } = useSelector(({ onBoardings }) => onBoardings), //
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(BROWSE({ key: { branchId: activePlatform?.branchId }, token }));
  }, [dispatch, activePlatform, token]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections?.length} Patient and Admission Info
        </span>
      </div>
    </MDBView>
  );
};

export default Header;
