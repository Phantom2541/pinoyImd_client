import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMonth,
  setYear,
} from "../../../../../services/redux/slices/monitoring/temperature";
import { Calendar as calendar } from "../../../../../services/fakeDb";
import CustomSelect from "../../../../../components/searchables/customSelect";
import "./style.css";

const Header = () => {
  const dispatch = useDispatch();
  const { month, year } = useSelector((state) => state.temperatures);

  return (
    <div className="header-container">
      <div className="d-flex">
        <CustomSelect
          className="m-0 p-0 calendar mr-4"
          value={month}
          onChange={(value) => dispatch(setMonth(value))}
          inputClassName="m-0 p-0"
          preValue={month}
          choices={calendar.Months}
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
  );
};

export default Header;
