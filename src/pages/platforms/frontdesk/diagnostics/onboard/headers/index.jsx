import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Search from "./search";
import Sourcing from "./sourcing.jsx";
import Status from "./status.jsx";

import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator.js";

export default function Header({
  length,
  view,
  setView,
  searchKey,
  setSearchKey,
  didSearch,
}) {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
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

  useEffect(() => {
    console.log("status", status);
  }, [status]);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <span className="mr-3 font-weight-bold">Status:</span>
        <Status setStatus={setStatus} />
        <span className="mx-3 font-weight-bold">Sources:</span>
        <Sourcing onChange={setView} length={length} view={view} />
      </div>
      <Search
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        didSearch={didSearch}
      />
    </div>
  );
}
