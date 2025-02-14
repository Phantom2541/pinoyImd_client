import React, { useEffect, useState } from "react";
import Calendar from "./calendar";
import { MDBCard, MDBContainer, MDBBtn, MDBIcon } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "./../../../../../services/redux/slices/monitoring/temperature";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { Calendar as calendar } from "./../../../../../services/fakeDb";
import Swal from "sweetalert2"; // Import Swal for notifications

const today = new Date();

export default function Temperature() {
  const [month, setMonth] = useState(today.getMonth()),
    [year, setYear] = useState(today.getFullYear()),
    { token, onDuty } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(
      ({ temperatures }) => temperatures
    ), // Adjust selector for ledger data
    dispatch = useDispatch();

  useEffect(() => {
    if (token && onDuty._id && year && month) {
      dispatch(
        BROWSE({
          token,
          key: {
            branchId: onDuty._id,
            start: new Date(year, month, 0),
            end: new Date(year, month + 1, 0, 23, 59, 59, 999),
          },
        })
      ).then((result) => {
        if (!result.payload || !result.payload?.length) {
          Swal.fire({
            icon: "warning",
            title: "Ledger Empty",
            text: "No data found for this month. Please generate the ledger.",
            confirmButtonText: "Okay",
          });
        }
      });
    }

    return () => dispatch(RESET());
  }, [token, dispatch, onDuty, month, year]);
  const handlePrint = () => {
    localStorage.setItem("temperature", JSON.stringify(collections));
    window.open(
      "/printout/TempGraph",
      "Temperature Graph",
      "top=100px,left=100px,width=1050px,height=750px" // size of page that will open
    );
  };

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
          <MDBBtn
            type="submit"
            disabled={isLoading}
            color="info"
            className="mb-2"
            rounded
            onClick={() => handlePrint("PRINT")}
          >
            <MDBIcon icon="print" />
          </MDBBtn>
        </div>
        <Calendar month={month} year={year} />
      </MDBCard>
    </MDBContainer>
  );
}
