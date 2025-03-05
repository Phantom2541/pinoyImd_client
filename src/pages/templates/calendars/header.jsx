import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendar as calendar } from "./../../../services/fakeDb";
import Search from "../../../components/searchables/users";
import CustomSelect from "../../../components/searchables/customSelect";
import "./style.css";

const today = new Date();

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    [month, setMonth] = useState(
      today.toLocaleString("en-US", { month: "long" })
    ),
    [year, setYear] = useState(today.getFullYear()),
    // { censusLoading: isLoading } = useSelector(({ sales }) => sales),
    dispatch = useDispatch();

  useEffect(() => {
    // if (token && activePlatform?.branchId && year && month)
    //   dispatch(
    //     CENSUS({
    //       token,
    //       key: {
    //         branchId: activePlatform?.branchId,
    //         start: new Date(year, month, 0),
    //         end: new Date(year, month + 1, 0, 23, 59, 59, 999),
    //         isManager: true,
    //       },
    //     })
    //   );
    // return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);
  const setPatient = (patient) => {
    console.log("patient", patient);
  };
  const setRegister = (user) => {
    console.log("user", user);
  };
  console.log("yearrrrr", year);
  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex ">
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

          {/* <select
            disabled={isLoading}
            className="ledger-select"
            value={month}
            onChange={({ target }) => setMonth(Number(target.value))}
          >
            {calendar.Months?.map((month, index) => {
              return (
                <option key={`month-${index}`} value={index}>
                  {month}
                </option>
              );
            })}
          </select> */}
          {/* <select
            disabled={isLoading}
            className="ledger-select ml-2 bg-light"
            value={year}
            onChange={({ target }) => setYear(Number(target.value))}
          >
            {calendar.Years?.map((year, index) => {
              return (
                <option key={`year-${index}`} value={year}>
                  {year}
                </option>
              );
            })}
          </select> */}
        </div>
      </div>

      <div className="d-flex align-items-center">
        <span className="white-text mx-3 text-nowrap mt-0">Calendars </span>
        <Search setPatient={setPatient} setRegister={setRegister} />
      </div>
    </MDBView>
  );
};

export default Header;
