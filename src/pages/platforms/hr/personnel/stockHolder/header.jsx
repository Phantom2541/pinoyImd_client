import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { Policy } from "../../../../../services/fakeDb";
import { BOARD_MEMBERS } from "../../../../../services/redux/slices/assets/persons/personnels";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ personnels }) => personnels),
    branchId = activePlatform?.branchId,
    dispatch = useDispatch();
  const handlePrintout = () => {
    window.print();
  };

  // keys keys:{branchId,designations:Policy.getBoardMembersIds()}
  useEffect(() => {
    if (token && branchId) {
      dispatch(
        BOARD_MEMBERS({
          token,
          params: {
            branchId,
            designations: Policy.getBoardMembersIds(),
          },
        })
      );
    }
  }, [dispatch, token, branchId]);

  //initial values

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Stock Holders
        </span>
      </div>
      <div>
        <MDBBtn size="sm" color="info" onClick={() => handlePrintout()}>
          <MDBIcon icon="print" />
        </MDBBtn>
      </div>
    </MDBView>
  );
};

export default Header;
