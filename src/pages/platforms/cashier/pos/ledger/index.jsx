import React, { useEffect, useState } from "react";
import Calendar from "./calendar";
import { MDBCard, MDBContainer } from "mdbreact";
import {
  CENSUS,
  RESET,
} from "./../../../../../services/redux/slices/commerce/sales";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { Calendar as calendar } from "./../../../../../services/fakeDb";

// create new api, for ledger browse.
// if ledger is empty, notify to generate
// must wait for the process to complete

const today = new Date();

export default function Ledger() {
  const [month, setMonth] = useState(today.getMonth()),
    [year, setYear] = useState(today.getFullYear()),
    { token, onDuty, auth } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ sales }) => sales),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && onDuty._id && year && month)
      dispatch(
        CENSUS({
          token,
          key: {
            user: auth._id,
            branchId: onDuty._id,
            start: new Date(year, month, 0),
            end: new Date(year, month + 1, 0, 23, 59, 59, 999),
          },
        })
      );

    return () => dispatch(RESET());
  }, [token, dispatch, onDuty, month, year, auth._id]);

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
        </div>
        <Calendar month={month} year={year} />
      </MDBCard>
    </MDBContainer>
  );
}
