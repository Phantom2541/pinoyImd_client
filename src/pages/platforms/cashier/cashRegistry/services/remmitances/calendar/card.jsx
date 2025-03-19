import React from "react";
import Indicator from "./indicator";
import Footer from "./footer";
import { currency } from "../../../../../../../services/utilities";

const Card = ({ txt, num, index, item = {} }) => {
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);
  const { opening, expenses, totalSales } = item;

  return (
    <div
      className={`calendar-card ${num ? "" : "opacity-0 pointer-events-none"}`}
      key={`pos-calendar-${index}`}
    >
      <Indicator num={num} week={week} isFuture={isFuture} />
      <div className="d-flex items-center">
        <div className="sales-card-info mr-4 mt-3">
          {opening?.sum > 0 && (
            <h6 className="mb-1" title="Floating Cash">
              FC: {currency(opening.sum)}
            </h6>
          )}
          {totalSales > 0 && (
            <h6 className="mb-1" style={{ whiteSpace: "nowrap" }}>
              Sales: {currency(totalSales)}
            </h6>
          )}
          {expenses > 0 && (
            <h6 className="mb-1" style={{ whiteSpace: "nowrap" }}>
              Remitted: {currency(expenses)}
            </h6>
          )}
        </div>
      </div>
      {!isFuture && <Footer num={num} item={item} />}
    </div>
  );
};

export default Card;
