// Header.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBIcon, MDBBtn } from "mdbreact";
import {
  setMonth,
  setYear,
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/monitoring/temperature";
import { Calendar as calendar } from "../../../../../services/fakeDb";
import CustomSelect from "../../../../../components/searchables/customSelect";
import "./style.css";

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
      <div className="d-flex">
        <CustomSelect
          className="m-0 p-0 calendar mr-4"
          value={monthLabel}
          onChange={(value) => {
            const selectedMonth = isObjectFormat
              ? monthsArray.find((m) => m.label === value)
              : { value: monthsArray.indexOf(value) + 1 };
            dispatch(setMonth(selectedMonth?.value || month));
          }}
          preValue={monthLabel}
          choices={
            isObjectFormat ? monthsArray.map((m) => m.label) : monthsArray
          }
        />
        <CustomSelect
          className="m-0 p-0 calendar"
          value={year}
          onChange={(value) => dispatch(setYear(value))}
          preValue={year}
          choices={calendar.Years}
        />
      </div>
      <MDBBtn
        type="submit"
        disabled={isLoading}
        color="info"
        className="mb-2"
        rounded
        onClick={handlePrint}
      >
        <MDBIcon icon="print" />
      </MDBBtn>
    </MDBView>
  );
};

export default Header;
