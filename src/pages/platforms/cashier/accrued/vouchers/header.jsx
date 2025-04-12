import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  VOUCHERS,
  SetFilterBySOURCE,
  RESET,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBView } from "mdbreact";
const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const { collections, month, year } = useSelector(({ deals }) => deals),
    [sources, setSources] = useState([]),
    dispatch = useDispatch();
  // Fetch vouchers
  useEffect(() => {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    endDate.setHours(23, 59, 59, 999);
    dispatch(
      VOUCHERS({
        token,
        key: {
          branchId: activePlatform.branchId,
          cashierId: auth._id,
        },
      })
    );

    return () => dispatch(RESET());
  }, [dispatch, maxPage, activePlatform, auth._id, year, month, token]);

  //Filtering Cashier ID
  useEffect(() => {
    let uniqueSource = [];
    if (collections.length > 0)
      uniqueSource = [
        ...new Map(
          collections.map(({ source }) => [
            source?._id || "undefined",
            { _id: source?._id, displayname: source?.displayname || "" },
          ])
        ).values(),
      ];

    console.log("uniqueSource", uniqueSource);
    console.log("collections", collections);

    setSources(uniqueSource);
  }, [collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div
        className="d-flex justify-items-center ml-2"
        style={{ width: "20rem" }}
      >
        <i>Voucher List</i>
      </div>
      <div>
        <div className="text-right d-flex items-center ">
          <select
            id="cashier-select"
            className="custom-select mr-2"
            onChange={(e) => dispatch(SetFilterBySOURCE(e.target.value))}
          >
            <option value="" disabled>
              Select a Source
            </option>
            <option key="all" value="all">
              Select all
            </option>
            {sources?.map((source, index) => (
              <option key={`source-${index}`} value={source?._id}>
                {source?.displayname}
              </option>
            ))}
          </select>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
