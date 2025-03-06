import React from "react";
import "./style.css";
import { generateCalendar } from "../../../../../../services/utilities";
import { useSelector } from "react-redux";
import WeekHeader from "./wigets/weekHeader";
import Indicator from "./wigets/indicator";
import Card from "./wigets/Card";

const today = new Date();

export default function Calendar({ month, year }) {
  const { census, isLoading } = useSelector(({ sales }) => sales);
  // { grossSales, patients } = census;

  return (
    <div className="pos-ledger-calendar p-3">
      <WeekHeader />
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
              <Indicator num={num} week={week} isFuture={isFuture} />
              {num && (
                <Card
                  isFuture={isFuture}
                  isLoading={isLoading}
                  sales={sales}
                  total={total}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
