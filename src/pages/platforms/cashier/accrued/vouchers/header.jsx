import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  VOUCHERS,
  SetFilterByCASHIER,
  OnMoved,
  RESET,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import CalendarHeader from "../../../../../components/header/calendars";

const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const { collections, filterByCashier, cashiers, month, year } = useSelector(
    ({ deals }) => deals
  );
  const dispatch = useDispatch();
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

  return (
    <div className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center">
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Services
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <CalendarHeader
            month={month}
            year={year}
            prev={() => dispatch(OnMoved("prev"))}
            next={() => dispatch(OnMoved("next"))}
          />
          {/* Regular HTML select for Cashiers Dropdown */}
          <label htmlFor="cashier-select" className="mr-2">
            Select Cashier
          </label>
          <select
            id="cashier-select"
            className="custom-select"
            value={filterByCashier}
            onChange={(e) => dispatch(SetFilterByCASHIER(e.target.value))}
          >
            <option value="" disabled>
              Select a cashier
            </option>
            <option value="all">Select a all</option>

            {cashiers.map((cashier) => (
              <option key={cashier._id} value={cashier._id}>
                {cashier.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
