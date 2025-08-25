import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendars } from "../../../../../components/header";
import {
  BROWSE,
  SetMONTH,
  ResetDATE,
} from "../../../../../services/redux/slices/market/attendances";

const Header = () => {
  const dispatch = useDispatch();

  const { month, year, collections = [] } = useSelector(
    ({ attendances }) => attendances
  );
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (!token || !activePlatform?.branchId) return;

    dispatch(
      BROWSE({
        token,
        params: {
          branchId: activePlatform?.branchId,
          createdAt: new Date(year, month - 1, 1),
          endDate: new Date(year, month, 0, 23, 59, 59, 999),
        },
      })
    );
  }, [token, dispatch, activePlatform, month, year]);

  const hasRecordForCurrentMonth = collections.some((item) => {
    const date = new Date(item.createdAt);
    return date.getMonth() === month - 1 && date.getFullYear() === year;
  });

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-start align-items-center"
    >
      <Calendars
        month={month}
        moved={(action) => dispatch(SetMONTH(action))}
        year={year}
        reset={() => dispatch(ResetDATE())}
      />
      
      {!hasRecordForCurrentMonth && (
        <span className="text-white ml-3">No records found this month</span>
      )}
    </MDBView>
  );
};

export default Header;
