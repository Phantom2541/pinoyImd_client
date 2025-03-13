import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";

import Sourcing from "./sourcing.jsx";
import Status from "./status.jsx";

import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator.js";

export default function Header({ length, view, setView }) {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ taskGenerator }) => taskGenerator),
    [status, setStatus] = useState("All"),
    dispatch = useDispatch();

  //Initial Browse and Fetch Data
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      dispatch(
        BROWSE({
          key: {
            branchId: activePlatform?.branchId,
            createdAt: new Date().setHours(0, 0, 0, 0),
          },
          token,
        })
      );
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform, auth]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          Total - {collections.length}
        </span>
      </div>

      <div className="text-right d-flex items-center">
        <span className="mr-3 font-weight-bold">Status:</span>
        <Status setStatus={setStatus} />
        <span className="mx-3 font-weight-bold">Sources:</span>
        <Sourcing onChange={setView} view={view} />
      </div>
    </MDBView>
  );
}
