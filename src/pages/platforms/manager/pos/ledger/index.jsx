import React, { useEffect, useState } from "react";
import Calendar from "./calendar";
import { MDBBtn, MDBCard, MDBContainer } from "mdbreact";
import {
  CENSUS,
  RESET,
} from "./../../../../../services/redux/slices/commerce/sales";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  // Services,
  Calendar as calendar,
} from "./../../../../../services/fakeDb";
// import { currency, fullName } from "./../../../../../services/utilities";
// import Excel from "./excel";
import Modal from "./census";

// create new api, for ledger browse.
// if ledger is empty, notify to generate
// must wait for the process to complete

const today = new Date();

export default function Ledger() {
  const [month, setMonth] = useState(today.getMonth()),
    [year, setYear] = useState(today.getFullYear()),
    { token, onDuty } = useSelector(({ auth }) => auth),
    // { census, isLoading } = useSelector(({ sales }) => sales),
    { censusLoading: isLoading } = useSelector(({ sales }) => sales),
    [show, setShow] = useState(false),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && onDuty._id && year && month)
      dispatch(
        CENSUS({
          token,
          key: {
            branchId: onDuty._id,
            start: new Date(year, month, 0),
            end: new Date(year, month + 1, 0, 23, 59, 59, 999),
            isManager: true,
          },
        })
      );

    return () => dispatch(RESET());
  }, [token, dispatch, onDuty, month, year]);

  // const handleDownloadExcel = () => {
  //   const {
  //     services: _services,
  //     days: _days,
  //     menus: _menus,
  //     monthlySale,
  //     patients,
  //     expenses,
  //   } = census;

  //   const days = Object.entries(_days).map(
  //     ([day, { sales: patients, total: sales }]) => ({
  //       day,
  //       sales,
  //       patients: patients.length,
  //     })
  //   );

  //   const menus = Object.entries(_menus).map(
  //     ([menus, { capital, walkin, referral }], i) => ({
  //       "#": i + 1,
  //       menus,
  //       capital: currency(capital),
  //       "walk-in": walkin,
  //       referral,
  //       total: walkin + referral,
  //     })
  //   );

  //   const services = Object.entries(_services).map(
  //     ([key, { walkin, referral }], i) => ({
  //       "#": i + 1,
  //       services: Services.getName(key),
  //       "walk-in": walkin,
  //       referral,
  //       total: walkin + referral,
  //     })
  //   );

  //   Excel({
  //     monthlySale: currency(monthlySale),
  //     patients,
  //     expenses: currency(expenses),
  //     title: `${onDuty?.name} Ledger_${calendar.Months[month]}, ${year}`,
  //     preparedBy: fullName(auth?.fullName),
  //     tables: {
  //       days,
  //       menus,
  //       services,
  //     },
  //   });
  // };

  // const generateLedger = () => {
  //   console.log("still in progress");
  // };

  const modalCensus = () => setShow(!show);

  return (
    <MDBContainer className="d-grid" fluid>
      <MDBCard className="p-3">
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
          <div>
            <MDBBtn
              disabled={isLoading}
              size="sm"
              color="info"
              onClick={modalCensus}
            >
              Census
            </MDBBtn>
            {/* {month === today.getMonth() && year === today.getFullYear() && (
              <MDBBtn
                disabled={isLoading}
                size="sm"
                color="primary"
                onClick={generateLedger}
              >
                Generate Ledger
              </MDBBtn>
            )} */}
            {/* <MDBBtn
              disabled={isLoading}
              size="sm"
              color="success"
              onClick={handleDownloadExcel}
            >
              Download Excel
            </MDBBtn> */}
          </div>
        </div>
        <Calendar month={month} year={year} />
      </MDBCard>
      <Modal setShow={setShow} show={show} toggle={modalCensus} />
    </MDBContainer>
  );
}
