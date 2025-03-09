import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBIcon, MDBView, MDBBtn } from "mdbreact";
import {
  RESET,
  INSOURCE,
  SetCREATE,
} from "../../../../../services/redux/slices/assets/providers";
import Search from "../../../../../components/searchables/sources";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  useEffect(() => {
    // console.log("Outside if");
    if (token && activePlatform?.branchId) {
      dispatch(
        INSOURCE({
          token,
          key: {
            vendors: activePlatform?.branchId,
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
        <span className="white-text mx-3 text-nowrap mt-0">Sources </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search sources={collections} />

          <MDBBtn
            size="sm"
            className="px-2"
            rounded
            color="success"
            onClick={() => dispatch(SetCREATE())}
          >
            <MDBIcon icon="plus" />
          </MDBBtn>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
