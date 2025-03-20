import React from "react";
import { useSelector } from "react-redux";
import { generateCalendar } from "../../../../../../services/utilities";
import WeekHeader from "./weekHeader";
import Card from "./card";
import "./style.css";

export default function Calendar() {
  const { month, year } = useSelector(({ temperatures }) => temperatures);

  // const { month = new Date().getMonth(), year = new Date().getFullYear() } =
  //   useSelector(({ sales }) => sales);

  return (
    <div className="calendar-template p-3">
      <WeekHeader />
      <div className="calendar-body">
        {generateCalendar(month - 1, year).map(({ num, txt = "" }, index) => {
          return <Card key={index} num={num} txt={txt} index={index} />;
        })}
      </div>
    </div>
  );
}
