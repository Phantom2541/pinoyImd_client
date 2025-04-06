import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  BROWSE,
  SetMONTH,
  SetFILTERByCategories,
} from "../../../../../services/redux/slices/finance/journals/payments";
import { Statements } from "./components";
import CalendarPicker from "../../../../../components/header/calendars";

export default function TopHeader() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ payments }) => payments),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            year,
            month,
          },
        })
      );
    }
    // return () => dispatch(RESET());
  }, [token, activePlatform, year, month, dispatch]);

  const handleCategories = (categories) => {
    dispatch(SetFILTERByCategories(categories));
    // console.log(categories);
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <CalendarPicker
          month={month}
          year={year}
          moved={(next) => dispatch(SetMONTH(next))}
          reset={() => dispatch(RESET())}
        />
      </div>
      <span className="white-text mx-3 text-nowrap mt-0">Payments </span>
      <div>
        <div className="text-right d-flex items-center">
          <Statements setCategories={handleCategories} />
        </div>
      </div>
    </MDBView>
  );
}
