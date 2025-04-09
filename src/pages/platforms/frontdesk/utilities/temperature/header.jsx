// Header.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBIcon, MDBBtn } from "mdbreact";
import { Calendar as calendar } from "../../../../../services/fakeDb";
import { Select } from "../../../../../components/customizable";
import "./style.css";
import {
  setMonth,
  setYear,
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/monitoring/temperature";
import CalendarPicker from "../../../../../components/header/calendars";

const Header = () => {
  const dispatch = useDispatch();
  const { collections, isLoading, month, year } = useSelector(
    ({ temperatures }) => temperatures
  );
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform.branchId,
            start: new Date(year, month - 1, 1),
            end: new Date(year, month, 0, 23, 59, 59, 999),
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  const monthsArray = calendar?.Months || [];
  const isObjectFormat =
    monthsArray.length > 0 && typeof monthsArray[0] === "object";
  const monthLabel = isObjectFormat
    ? monthsArray.find((m) => m.value === month)?.label || month
    : monthsArray[month - 1] || month;

  const handlePrint = () => {
    localStorage.setItem("temperature", JSON.stringify(collections));
    console.log("collections: ", collections);

    window.open(
      "/printout/TempGraph",
      "Temperature Graph",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex">
          <CalendarPicker
            month={month}
            year={year}
            moved={dispatch}
            reset={() => dispatch(setMonth(0))}
          />
        </div>
      </div>
      <div className="d-flex align-items-center">
        <span className="white-text mx-3 text-nowrap mt-0">Print </span>
        <MDBBtn
          type="submit"
          disabled={isLoading}
          color="info"
          className="mb-2"
          rounded
          // onClick={() => handlePrint}
          onClick={handlePrint}
        >
          <MDBIcon icon="print" />
        </MDBBtn>
      </div>
    </MDBView>
  );
};

export default Header;
