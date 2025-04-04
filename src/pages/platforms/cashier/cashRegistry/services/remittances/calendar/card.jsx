import React from "react";
import Indicator from "./indicator";
import Footer from "./footer";
import {
  currency,
  paymentMethod,
} from "../../../../../../../services/utilities";

const Card = ({ txt, num, index, item = {} }) => {
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);

  const {
    opening = {},
    expenses = 0,
    gross = 0,
    collector,
    closing,
    breakdown,
  } = item;
  const net = (opening.sum || 0) + gross - expenses;
  const isRemitted = !!collector;

  console.log("breakdown", breakdown);

  return (
    <div>
      <div
        className={`cashier-rermmitance-calendar-card ${
          num ? "" : "opacity-0 pointer-events-none"
        }`}
        key={`pos-calendar-${index}`}
      >
        <Indicator num={num} week={week} isFuture={isFuture} />

        <div className="sales-card-info mt-3">
          {[
            { label: "FC", value: opening.sum },
            { label: "Sales", value: gross },
            {
              label: "Total",
              value: gross ? gross + opening.sum : 0,
              cn: "font-weight-bold",
            },
            { label: "Expenses", value: 20, cn: "text-danger" },
          ]
            .filter(({ value }) => value > 0)
            .map(({ label, value, cn }, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center justify-content-between"
              >
                <h6
                  className={`mb-0 text-right ${cn}`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {label}:
                </h6>
                <h6
                  className={`mb-0 text-right ${cn}`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {currency(value)}
                </h6>
              </div>
            ))}

          {/* 🟢 Show COH only if transactions exist */}
          {!!closing && (
            <>
              <hr className="my-1" />
              <h6 style={{ fontSize: "0.8rem" }}>BREAK DOWN</h6>
              {/* {breakdown &&
                Object.entries(breakdown).map(([key, value]) => {
                  const paymentData = paymentMethod.getImage(key); // Get payment method data
                  return (
                    <div
                      key={key}
                      className="d-flex align-items-center text-white"
                    >
                      {paymentData?.img ? (
                        <img
                          src={paymentData.img} // ✅ Use an <img> tag
                          alt={key}
                          className="mr-2"
                          style={{ width: 24, height: 24 }} // Adjust size if needed
                        />
                      ) : (
                        "💰"
                      )}
                      <span>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                        <strong className="text-info">
                          ₱{value.toLocaleString()}
                        </strong>
                      </span>
                    </div>
                  );
                })} */}
              {/* <hr /> */}
              <div style={{ position: "absolute", bottom: 0 }}>
                <h6
                  className="mb-0 text-right font-weight-bold"
                  style={{
                    whiteSpace: "nowrap",
                    color: isRemitted ? "inherit" : "green", // 🟢 Green only for COH, regular if remitted
                  }}
                >
                  {isRemitted ? "Remitted" : "GROSS"}: {currency(net)}
                </h6>
              </div>
            </>
          )}
        </div>

        {!isFuture && !isRemitted && <Footer num={num} item={item} />}
      </div>
    </div>
  );
};

export default Card;
