import React from "react";
import Indicator from "./indicator";
import Footer from "./footer";
import { currency } from "../../../../../../../services/utilities";

const Card = ({ txt, num, index, item = {} }) => {
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);

  const { opening = {}, expenses = 0, gross = 0, collector, closing } = item;
  const net = (opening.sum || 0) + gross - expenses;
  const isRemitted = !!collector;

  return (
    <div
      className={`calendar-card ${num ? "" : "opacity-0 pointer-events-none"}`}
      key={`pos-calendar-${index}`}
    >
      <Indicator num={num} week={week} isFuture={isFuture} />

      <div className="sales-card-info mt-2">
        {[
          { label: "FC", value: opening.sum },
          { label: "Sales", value: gross },
          {
            label: "Total",
            value: gross ? gross + opening.sum : 0,
            cn: "font-weight-bold",
          },
          { label: "Expenses", value: expenses, cn: "text-danger" },
        ]
          .filter(({ value }) => value > 0)
          .map(({ label, value, cn }, idx) => (
            <h6
              key={idx}
              className={`mb-0 text-right ${cn}`}
              style={{ whiteSpace: "nowrap" }}
            >
              {label}: {currency(value)}
            </h6>
          ))}

        {/* 🟢 Show COH only if transactions exist */}
        {!!closing && (
          <>
            <hr className="my-1" />
            <h6
              className="mb-0 text-right font-weight-bold"
              style={{
                whiteSpace: "nowrap",
                color: isRemitted ? "inherit" : "green", // 🟢 Green only for COH, regular if remitted
              }}
            >
              {isRemitted ? "Remitted" : "COH"}: {currency(net)}
            </h6>
          </>
        )}
      </div>

      {!isFuture && !isRemitted && <Footer num={num} item={item} />}
    </div>
  );
};

export default Card;
