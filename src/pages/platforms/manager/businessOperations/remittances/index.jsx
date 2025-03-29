import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Summary from "./summary";
import { MDBRow } from "mdbreact";
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
      const createdAt = new Date(year, month, 1);
      createdAt.setHours(0, 0, 0, 0);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
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
      <MDBRow className="w-100 mx-auto">
        <Calendar />
      </MDBRow>
      <Denomination />
    </div>
  );
}
