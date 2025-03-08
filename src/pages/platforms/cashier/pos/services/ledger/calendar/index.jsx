import React from "react";
import "./index.css";
import {
  currency,
  generateCalendar,
} from "../../../../../../../services/utilities";
import { useSelector } from "react-redux";
import { MDBIcon } from "mdbreact";

const today = new Date();

export default function Calendar({ month, year }) {
  const { census, isLoading } = useSelector(({ sales }) => sales),
    { grossSales, patients } = census;

  return (
    <div className="pos-ledger-calendar">
      <div className="pos-ledger-calendar-header">
        <span>
          <small>Sales</small> - {currency(grossSales)}
        </span>
        <span>
          <small>Patients</small> - {patients}
        </span>
      </div>
      <div className="pos-ledger-calendar-weeks">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="pos-ledger-calendar-daily">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => {
          const { sales = [], total = 0 } = census?.daily[txt] ?? {},
            date = new Date(txt),
            week = txt.slice(0, 3),
            isPresent =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear(),
            isFuture = date > today ? true : false;

          return (
            <div
              style={{
                backgroundColor: isPresent && "lightgreen",
              }}
              className={`${!num && "empty"}`}
              key={`pos-calendar-${index}`}
            >
              {num && (
                <>
                  <small
                    className={`${week === "Sun" && "sunday"} ${
                      isFuture && "future"
                    }`}
                  >
                    {num}
                  </small>
                  {isFuture ? (
                    " "
                  ) : isLoading ? (
                    <MDBIcon icon="spinner" pulse />
                  ) : !sales.length ? (
                    <span> </span>
                  ) : (
                    <>
                      <span>{currency(total)}</span>
                      <span>Patients - {sales.length}</span>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
