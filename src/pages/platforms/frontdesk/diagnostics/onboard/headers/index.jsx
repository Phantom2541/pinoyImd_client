import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";

import Sourcing from "./sourcing.jsx";
import Status from "./status.jsx";
import Search from "./search.jsx";

import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator.js";

export default function Header({ view, setView }) {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ taskGenerator }) => taskGenerator),
    [status, setStatus] = useState("All"),
    [searchKey, setSearchKey] = useState(""),
    dispatch = useDispatch();

  //Initial Browse and Fetch Data
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      const timezone = Intl.DateTimeFormat().resolvedOptions()?.timeZone;
      const now = new Date();
      const createdAt = `${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${now
        .getDate()
        .toString()
        .padStart(2, "0")}/${now.getFullYear()}`;
      dispatch(
        BROWSE({
          key: {
            branchId: activePlatform?.branchId,
            createdAt,
            department: activePlatform?.department,
            timezone,
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
        <Status setStatus={setStatus} status={status} />
        <span className="mx-3 font-weight-bold">Sources:</span>
        <Sourcing onChange={setView} view={view} />
      </div>
      <div className="text-right">
        <Search searchKey={searchKey} setSearchKey={setSearchKey} didSearch />
      </div>
    </MDBView>
  );
}
