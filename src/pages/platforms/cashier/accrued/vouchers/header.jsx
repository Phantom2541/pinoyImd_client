import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  VOUCHERS,
  SetFilterBySOURCE,
  OnMoved,
  RESET,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import CalendarPicker from "../../../../../components/header/calendars";

const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const { collections, month, year } = useSelector(({ deals }) => deals),
    [sources, setSources] = React.useState([]),
    dispatch = useDispatch();
  // Fetch vouchers
  useEffect(() => {
    const startDate = new Date(year, month, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    endDate.setHours(23, 59, 59, 999);
    dispatch(
      VOUCHERS({
        token,
        key: {
          branchId: activePlatform.branchId,
          cashierId: auth._id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
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
            { _id: source?._id, name: source?.displayname || "" },
          ])
        ).values(),
      ];
    setSources(uniqueSource);
    console.log("uniqueSource :", uniqueSource);
  }, [collections]);

  return (
    <div className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center">
      <div
        className="d-flex justify-items-center ml-2"
        style={{ width: "20rem" }}
      >
        <CalendarPicker
          month={month}
          year={year}
          prev={() => dispatch(OnMoved("prev"))}
          next={() => dispatch(OnMoved("next"))}
        />
      </div>
      <div>
        <div className="text-right d-flex items-center ">
          <select
            id="cashier-select"
            className="custom-select mr-2"
            value={sources}
            onChange={(e) => dispatch(SetFilterBySOURCE(e.target.value))}
          >
            <option value="" disabled>
              Select a cashier
            </option>
            <option value="all">Select a all</option>

            {sources.map((source) => (
              <option key={source?._id} value={source?._id}>
                {source?.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
