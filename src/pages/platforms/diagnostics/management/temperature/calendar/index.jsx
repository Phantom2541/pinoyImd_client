import React, { useState } from "react";
import { useSelector } from "react-redux";
import { generateCalendar } from "../../../../../../services/utilities";
import WeekHeader from "./weekHeader";
import Card from "./card";
import "./style.css";

export default function Calendar() {
  const { month, year } = useSelector(({ temperatures }) => temperatures),
    [selected, setSelected] = useState({});

  return (
    <div className="temperature-calendar p-3">
      <WeekHeader />
      <div className="temperature-calendar-body">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => {
          return (
            <Card
              key={index}
              num={num}
              txt={txt}
              index={index}
              selected={selected}
              setSelected={setSelected}
            />
          );
        })}
      </div>
    </div>
  );
}
