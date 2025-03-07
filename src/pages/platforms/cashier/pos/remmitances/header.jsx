import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendar as calendar } from "./../../../../../services/fakeDb";
import CustomSelect from "./../../../../../components/searchables/customSelect";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/finance/bookkeeping/remittances";
import "./style.css";

const today = new Date();

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    [month, setMonth] = useState(
      today.toLocaleString("en-US", { month: "long" })
    ),
    [year, setYear] = useState(today.getFullYear()),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      const monthIndex = calendar.Months.indexOf(month); // Convert month name to index

      if (monthIndex === -1) return; // Handle invalid month selection

      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            start: new Date(year, monthIndex, 1), // First day of the month
            end: new Date(year, monthIndex + 1, 0, 23, 59, 59, 999), // Last day of the month
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex ">
          <span className="white-text mx-3 text-nowrap mt-0">Remittances</span>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <CustomSelect
          className="m-0 p-0 calendar mr-4"
          value={month}
          onChange={(value) => setMonth(value)}
          inputClassName="m-0 p-0"
          preValue={month}
          choices={calendar.Months}
        />
        <CustomSelect
          value={year}
          inputClassName="m-0 p-0"
          preValue={year}
          onChange={(value) => setYear(value)}
          className="m-0 p-0   calendar"
          choices={calendar.Years}
        />
      </div>
    </MDBView>
  );
};

export default Header;
