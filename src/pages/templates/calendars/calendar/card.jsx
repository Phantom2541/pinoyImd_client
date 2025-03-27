import React from "react";
import Indicator from "./indicator";
import Footer from "./footer";

const Card = ({ txt, num, index }) => {
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const isToday = dateCell.toDateString() === today.toDateString();
  const week = txt?.slice(0, 3);

  return (
    <div
      className={`calendar-card ${num ? "" : "opacity-0 pointer-events-none"}`}
      key={`pos-calendar-${index}`}
    >
      <Indicator num={num} week={week} isFuture={isFuture} isToday={isToday} />
      <div className="sales-card-body">
        <div className="d-flex"></div>
        <div className="d-flex items-center">
          <div className="sales-card-info mr-4">
            {!isFuture && <span>Put your value here</span>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Card;
