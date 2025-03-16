import React from "react";
import "./index.css";
import { generateCalendar } from "../../../../../../services/utilities";

import { useSelector } from "react-redux";
import DayCell from "./card";

export default function Calendar() {
  const { month, year } = useSelector(({ temperatures }) => temperatures);
  return (
    <div className="pos-ledger-calendar">
      <div className="pos-ledger-calendar-header"></div>
      <div className="pos-ledger-calendar-weeks">
        <div>Sun</div> <div>Mon</div> <div>Tue</div> <div>Wed</div>
        <div>Thu</div> <div>Fri</div> <div>Sat</div>
      </div>

      <div className="pos-ledger-calendar-daily">
        {generateCalendar(month - 1, year).map(({ num, txt = "" }, index) => (
          <DayCell key={num} num={num} txt={txt} index={index} />
        ))}
      </div>
    </div>
  );
}
