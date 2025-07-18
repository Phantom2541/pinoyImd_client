import React, { useState } from "react";
import { useSelector } from "react-redux";
import { generateCalendar } from "../../../../../../../services/utilities";
import WeekHeader from "./weekHeader";
import Card from "./card";
import "./style.css";

export default function Calendar({ summaryRef }) {
  const {
    collections,
    month = new Date().getMonth(),
    year = new Date().getFullYear(),
  } = useSelector(({ quest }) => quest);

  const [lastAnimatedCard, setLastAnimatedCard] = useState(null); // ✅ shared state

  const items = collections.reduce((acc, { createdAt, ...rest }) => {
    if (createdAt) {
      const date = new Date(createdAt).getUTCDate();
      if (!acc.has(date)) {
        acc.set(date, []);
      }
      acc.get(date).push({ createdAt, ...rest });
    }
    return acc;
  }, new Map());

  return (
    <div className="calendar-template">
      <WeekHeader />
      <div className="calendar-bodys w-100">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => (
          <Card
            key={index}
            num={num}
            txt={txt}
            items={items.get(num) || []}
            summaryRef={summaryRef}
            lastAnimatedCard={lastAnimatedCard}
            setLastAnimatedCard={setLastAnimatedCard}
          />
        ))}
      </div>
    </div>
  );
}
