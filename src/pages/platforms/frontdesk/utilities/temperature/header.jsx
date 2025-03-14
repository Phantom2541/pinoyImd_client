import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBIcon, MDBBtn } from "mdbreact";
import {
  setMonth,
  setYear,
} from "../../../../../services/redux/slices/monitoring/temperature";
import { Calendar as calendar } from "../../../../../services/fakeDb";
import CustomSelect from "../../../../../components/searchables/customSelect";
import "./style.css";

const Header = () => {
  const dispatch = useDispatch(),
    { month, year } = useSelector(({ temperatures }) => temperatures);

  // Siguraduhin na defined ang calendar.Months bago ito gamitin
  const monthsArray = calendar?.Months || [];

  // I-check kung ang format ay array ng { value, label } o array ng strings
  const isObjectFormat =
    monthsArray.length > 0 && typeof monthsArray[0] === "object";

  // Kunin ang pangalan ng buwan
  const monthLabel = isObjectFormat
    ? monthsArray.find((m) => m.value === month)?.label || month
    : monthsArray[month - 1] || month;

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex">
          <CustomSelect
            className="m-0 p-0 calendar mr-4"
            value={monthLabel}
            onChange={(value) => {
              if (isObjectFormat) {
                const selectedMonth = monthsArray.find(
                  (m) => m.label === value
                );
                dispatch(setMonth(selectedMonth?.value || month));
              } else {
                dispatch(setMonth(monthsArray.indexOf(value) + 1));
              }
            }}
            inputClassName="m-0 p-0"
            preValue={monthLabel}
            choices={
              isObjectFormat ? monthsArray.map((m) => m.label) : monthsArray
            }
          />
          <CustomSelect
            className="m-0 p-0 calendar"
            value={year}
            onChange={(value) => dispatch(setYear(value))}
            inputClassName="m-0 p-0"
            preValue={year}
            choices={calendar.Years}
          />
        </div>
      </div>
      <div className="d-flex align-items-center">
        {/* <span className="white-text mx-3 text-nowrap mt-0">Print </span> */}
        <MDBBtn
          type="submit"
          // disabled={isLoading}
          color="info"
          className="mb-2"
          rounded
          // onClick={() => handlePrint("PRINT")}
        >
          <MDBIcon icon="print" />
        </MDBBtn>
      </div>
    </MDBView>
  );
};

export default Header;
