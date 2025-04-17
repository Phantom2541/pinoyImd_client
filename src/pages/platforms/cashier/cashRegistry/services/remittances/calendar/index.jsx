import React from "react";
import { useSelector } from "react-redux";
import { generateCalendar } from "../../../../../../../services/utilities";
import WeekHeader from "./weekHeader";
import Card from "./card";
import "./style.css";

export default function Calendar() {
  const { collections: deals } = useSelector(({ deals }) => deals),
    { collections, month, year, isLoading } = useSelector(
      ({ remittances }) => remittances
    );

  const dateMap = new Map(
    collections
      .filter(({ createdAt }) => createdAt) // Filter out null/undefined dates
      .map(({ createdAt, ...rest }) => [
        new Date(createdAt).getUTCDate(),
        { createdAt, ...rest },
      ])
  );
  // calendar-template
  return (
    <div className="cashier-remittance-calendar p-3">
      <WeekHeader />
      <div className="cashier-calendar-remittance-body">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => {
          const item = dateMap.get(num) || {}; // Default to an empty object instead of null
          const localStart = new Date(year, month - 1, num);
          localStart.setHours(0, 0, 0, 0);

          const localEnd = new Date(localStart);
          localEnd.setHours(23, 59, 59, 999);
          const _deals = deals.filter(({ createdAt }) => {
            const created = new Date(createdAt); // UTC timestamp from DB
            return created >= localStart && created <= localEnd;
          });
          return (
            <Card
              key={num}
              num={num}
              txt={txt}
              item={item}
              isLoading={isLoading}
              deals={_deals}
            />
          );
        })}
      </div>
    </div>
  );
}
