import React from "react";
import { useSelector } from "react-redux";
import { generateCalendar } from "../../../../../../../services/utilities";
import WeekHeader from "./weekHeader";
import Card from "./card";
import "./style.css";

export default function Calendar() {
  const { collections: deals, isLoading: validation } = useSelector(
      ({ deals }) => deals
    ),
    { collections, month, year, isLoading } = useSelector(
      ({ remittances }) => remittances
    );

  return (
    <div className="cashier-remittance-calendar p-3">
      <WeekHeader />
      <div className="cashier-calendar-remittance-body">
        {generateCalendar(month, year).map(({ num, txt = "" }) => {
          const localDate = new Date(year, month - 1, num);
          localDate.setHours(0, 0, 0, 0); // normalize start of day

          const nextDate = new Date(localDate);
          nextDate.setDate(localDate.getDate() + 1); // exclusive upper bound

          // Get item for remittance (assumes only one per day)
          const item =
            collections.find(({ createdAt }) => {
              const dt = new Date(createdAt);
              return dt >= localDate && dt < nextDate;
            }) || {};

          // Get deals for this day
          const _deals = deals.filter(({ createdAt }) => {
            const dt = new Date(createdAt);
            return dt >= localDate && dt < nextDate;
          });
          return (
            <Card
              key={num}
              num={num}
              txt={txt}
              item={item}
              deals={_deals}
              isLoading={isLoading || validation}
            />
          );
        })}
      </div>
    </div>
  );
}
