import React from "react";
import Indicator from "./indicator";
import Footer from "./footer";
import {
  currency,
  paymentMethod,
} from "../../../../../../../services/utilities";
import { MDBAnimation, MDBProgress } from "mdbreact";
const Card = ({ txt, num, index, item = {}, isLoading = false }) => {
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);
  const isToday = dateCell.toDateString() === today.toDateString();

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

  return (
    <div className="position-relative">
      <div
        className={`cashier-rermmitance-calendar-card ${isToday && "today"} ${
          !isFuture && net && "sale"
        } ${num ? "" : "opacity-0 pointer-events-none"}`}
        key={`pos-calendar-${index}`}
      >
        <Indicator num={num} week={week} isFuture={isFuture} />

        {!isLoading ? (
          <>
            {" "}
            <div className="sales-card-info mt-3">
              {[
                { label: "FC", value: opening.sum, title: "Floating Cash" },
                { label: "Sales", value: gross },
                {
                  label: "Total",
                  value: gross ? gross + opening.sum : 0,
                  cn: "font-weight-bold",
                },
                { label: "Expenses", value: expenses, cn: "text-danger" },
              ]
                .filter(({ value }) => value > 0)
                .map(({ label, value, cn, title = "" }, idx) => (
                  <div
                    key={idx}
                    title={title}
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
                <div style={{ marginBottom: "1.8rem" }}>
                  <div className="cashier-remittance-breakdown">
                    <hr className="my-1" />

                    {breakdown &&
                      Object.entries(breakdown).map(([key, value]) => {
                        const paymentData = paymentMethod.getImage(key); // Get payment method data
                        const { img, style, text = "" } = paymentData;
                        return (
                          <div
                            key={key}
                            title={text}
                            className="d-flex align-items-center text-white justify-content-between"
                          >
                            {paymentData?.img ? (
                              <img
                                src={img} // ✅ Use an <img> tag
                                alt={key}
                                className="mr-2"
                                style={style} // Adjust size if needed
                              />
                            ) : (
                              "💰"
                            )}
                            <span>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                              <strong className="text-dark">
                                ₱{value.toLocaleString()}
                              </strong>
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  {/* <hr /> */}
                  <div
                    className="cashier-remittance-total"
                    style={{
                      position: "absolute",
                      bottom: "0rem",
                    }}
                  >
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
                </div>
              )}
            </div>
            {!isFuture && !isRemitted && <Footer num={num} item={item} />}
          </>
        ) : (
          <div>
            <MDBAnimation
              type="fadeIn"
              infinite
              delay={`100ms`}
              duration="3000ms"
              className="mt-3"
            >
              <MDBProgress animated color="light" value={3000}></MDBProgress>
            </MDBAnimation>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
