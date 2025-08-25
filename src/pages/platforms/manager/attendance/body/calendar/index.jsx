import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { generateCalendar } from "../../../../../../services/utilities";
import WeekHeader from "./weekHeader";
import Card from "./card";
import "./style.css";

export default function Calendar({ summaryRef }) {
  const {
    collections = [],
    month = new Date().getMonth() + 1, // month is 1-based
    year = new Date().getFullYear(),
  } = useSelector(({ attendances }) => attendances);

  const [lastAnimatedCard, setLastAnimatedCard] = useState(null);

  // ✅ group data by day number
  const items = useMemo(() => {
    const map = new Map();
    collections.forEach((att) => {
      const dateObj = new Date(att.createdAt || att.date); // fallback if date field differs
      const dayNum = dateObj.getDate();
      if (!map.has(dayNum)) map.set(dayNum, []);
      map.get(dayNum).push({ ...att, date: dateObj });
    });
    return map;
  }, [collections]);

  console.log("collections", collections);
  console.log("grouped items", items);

  return (
    <div className="calendar-template">
      <WeekHeader />
      <div className="calendar-bodys w-100">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => (
          <Card
            key={index}
            num={num}
            txt={txt}
            items={items.get(num) || []} // ✅ pass attendances for this day
            summaryRef={summaryRef}
            lastAnimatedCard={lastAnimatedCard}
            setLastAnimatedCard={setLastAnimatedCard}
          />
        ))}
      </div>
    </div>
  );
}
