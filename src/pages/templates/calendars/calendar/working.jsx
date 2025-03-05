import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { generateCalendar } from "./../../../../services/utilities";
import "./style.css";

export default function Calendar() {
  const { census, month = 2, year = 2025 } = useSelector(({ sales }) => sales);
  const { pathname } = useLocation();
  const history = useHistory();
  const today = new Date();

  const handleClick = (num, txt, isFuture, isEmpty) => {
    if (isFuture || isEmpty) {
      history.push(pathname);
      return;
    }

    const modalTitle = new Date(year, month, num).toDateString();
    const startDate = new Date(year, month, num).setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, num).setHours(23, 59, 59, 999);
    const queryParams = new URLSearchParams({
      dailyFilter: 1,
      startDate,
      endDate,
      modalTitle,
    }).toString();

    history.push(`${pathname}?${queryParams}`);
  };

  return (
    <div className="pos-ledger-calendar">
      <div className="pos-ledger-calendar-weeks">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="pos-ledger-calendar-daily">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => {
          const { sales = [] } = census?.daily?.[txt] || {};
          const isEmpty = sales.length === 0;
          const date = new Date(txt);
          const isFuture = date > today;
          const week = txt.slice(0, 3);

          return (
            <div
              key={`pos-calendar-${index}`}
              onClick={() => handleClick(num, txt, isFuture, isEmpty)}
            >
              {num && (
                <span className="text-left">
                  <small className={week === "Sun" ? "sunday" : ""}>
                    {num}
                  </small>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
