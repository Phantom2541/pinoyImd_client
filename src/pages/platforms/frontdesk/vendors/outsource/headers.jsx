import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  OUTSOURCE,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";
import { MDBCardHeader } from "mdbreact";
import { SearchBranch } from "../../../../../components/header";
const NewComponent = ({ setName, setShowModal }) => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        OUTSOURCE({ token, key: { clients: activePlatform?.branchId } })
      );
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform]);

  return (
    <MDBCardHeader className="d-flex justify-content-between">
      <h2>Outsource </h2>
      <SearchBranch />
    </MDBCardHeader>
  );
};

export default NewComponent;
