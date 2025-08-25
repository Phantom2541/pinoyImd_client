import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Summary from "./summary";
import Calendar from "./body";
import {
  BROWSE,
  RESET,
} from "../../../../services/redux/slices/market/attendances";

export default function Attendances() {
  const summaryRef = useRef();
  const [isSummaryReady, setIsSummaryReady] = useState(false);

  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ attendances }) => attendances),
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
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <Summary summaryRef={summaryRef} />
      </div>

      <div className="w-100">
        {isSummaryReady && <Calendar summaryRef={summaryRef} />}
      </div>
    </div>
  );
}
