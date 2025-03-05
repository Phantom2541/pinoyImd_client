import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendar as calendar } from "./../../../services/fakeDb";
import { CENSUS, RESET } from "./../../../services/redux/slices/commerce/sales";

const today = new Date();

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    [month, setMonth] = useState(today.getMonth()),
    [year, setYear] = useState(today.getFullYear()),
    { censusLoading: isLoading } = useSelector(({ sales }) => sales),
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

  return (
    <MDBView
      cascade
      style={{ position: "relative", overflow: "visible !important" }}
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <select
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
          </select>
          <select
            disabled={isLoading}
            className="ledger-select ml-2"
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
          </select>
        </div>
      </div>

      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Calendars </span>
      </div>
    </MDBView>
  );
};

export default Header;
