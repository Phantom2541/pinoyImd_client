import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Summary from "./summary";
import Calendar from "./calendars";
import Denomination from "./modal/denominations";

import {
  BROWSE,
  RESET,
} from "./../../../../../services/redux/slices/commerce/pos/services/deals";

export default function Remittances() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ remittances }) => remittances),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      const createdAt = new Date(year, month - 1, 1);
      createdAt.setHours(0, 0, 0, 0);
      // createdAt.setHours(createdAt.getHours() - 8);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      endDate.setHours(23, 59, 59, 999);

      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            createdAt,
            endDate,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  return (
    <div className="d-flex ">
      <div style={{ width: "300px" }}>
        <Summary />
      </div>
      <Calendar />
      <Denomination />
    </div>
  );
}
