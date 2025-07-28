import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Summary from "./summary";
import Calendar from "./body";
import Denomination from "./modal/denominations";
import {
  BROWSE,
  RESET,
} from "./../../../../../services/redux/slices/commerce/pos/services/deals";

export default function Remittances() {
  const summaryRef = useRef();
  const [isSummaryReady, setIsSummaryReady] = useState(false);

  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ remittances }) => remittances),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      const startDate = new Date(year, month - 1, 1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      endDate.setHours(23, 59, 59, 999);

      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  // ✅ Ensure Summary has mounted
  useEffect(() => {
    const checkIfReady = setInterval(() => {
      if (summaryRef.current) {
        setIsSummaryReady(true);
        clearInterval(checkIfReady);
      }
    }, 50);

    return () => clearInterval(checkIfReady);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "fixed",
          width: "300px",
          zIndex: 10,
        }}
      >
        <Summary summaryRef={summaryRef} />
      </div>

      <div
        style={{
          marginLeft: "300px", // same width as Summary
        }}
      >
        {isSummaryReady && <Calendar summaryRef={summaryRef} />}
        <Denomination />
      </div>
    </div>
  );
}
