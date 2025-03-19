import React from "react";
import { useSelector } from "react-redux";
import { generateCalendar } from "../../../../../../../services/utilities";
import WeekHeader from "./weekHeader";
import Card from "./card";
import "./style.css";

export default function Calendar() {
  const { collections, month, year } = useSelector(
    ({ remittances }) => remittances
  );

  return (
    <div className="calendar-template p-3">
      <WeekHeader />
      <div className="calendar-body">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => {
          const item = collections.find(({ createdAt }) => {
            if (!createdAt) return false; // Avoid errors if createdAt is undefined

            const date = new Date(createdAt); // Convert if it's a string
            return date.getDate() === num;
          });
          return <Card key={index} num={num} txt={txt} item={item} />;
        })}
      </div>
    </div>
  );
}
