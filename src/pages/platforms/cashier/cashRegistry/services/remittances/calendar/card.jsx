import Indicator from "./indicator";
import Footer from "./footer";
import {
  currency,
  paymentMethod,
} from "../../../../../../../services/utilities";
import { MDBAnimation, MDBProgress } from "mdbreact";
// import { useSelector } from "react-redux";
const Card = ({ txt, num, index, item = {}, isLoading = false, deals }) => {
  // const { collections } = useSelector(({ payments }) => payments);
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);
  const isToday = dateCell.toDateString() === today.toDateString();

  const {
    opening = {},
    sales: gross = 0,
    collector,
    closing,
    breakdown = {},
    expenses = 0,
  } = item;

  const isRemitted = !!collector;

  const { cash, ...rest } = breakdown;
  const nonCash = Object.entries(rest);
  const net = (opening.sum || 0) + cash - expenses;

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
            <div className="sales-card-info mt-3">
              {gross > 0 && (
                <div className="d-flex align-items-center justify-content-between">
                  <h6
                    className={`mb-0 text-right `}
                    style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                  >
                    Sales:
                  </h6>
                  <div
                    style={{
                      flexGrow: 1,
                      borderBottom: "1px dashed #999",
                      margin: "0 10px",
                    }}
                  />

                  <h6
                    className={`mb-0 text-right`}
                    style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                  >
                    {currency(gross)}
                  </h6>
                </div>
              )}

              {nonCash.length > 0 && (
                <>
                  <div
                    className="d-flex align-items-center "
                    style={{ marginBottom: "-10px" }}
                  >
                    <h6
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: 400,
                      }}
                    >
                      Non-Cash:
                    </h6>
                  </div>
                  {nonCash.map(([key, value], idx) => (
                    <div
                      key={idx}
                      style={{ fontSize: "0.5rem" }}
                      className="d-flex align-items-center justify-content-between ml-3 mt-1"
                    >
                      <h6
                        className={`mb-0 text-right `}
                        style={{
                          whiteSpace: "nowrap",
                          fontSize: "0.8rem",
                          color: "green",
                          fontWeight: 400,
                        }}
                      >
                        {key}:
                      </h6>

                      <div
                        style={{
                          flexGrow: 1,
                          borderBottom: "1px dashed #999",
                          margin: "0 10px",
                        }}
                      />

                      <h6
                        className={`mb-0 text-right `}
                        style={{
                          whiteSpace: "nowrap",
                          fontWeight: 400,
                          color: "green",
                          fontSize: "0.8rem",
                        }}
                      >
                        {currency(value)}
                      </h6>
                    </div>
                  ))}
                </>
              )}
              {[
                {
                  label: "Cash Payment",
                  value: breakdown?.cash !== gross ? breakdown?.cash : 0,
                  // value: breakdown?.cash ? breakdown?.cash : 0,
                },
                {
                  label: " Add: FC",
                  value: opening.sum,
                  title: "Floating Cash",
                },
                {
                  label: "Total:",
                  value: breakdown?.cash + opening.sum,
                },
                { label: "Expenses", value: expenses, cn: "text-danger" },
              ]
                .filter(({ value }) => value > 0)
                .map(({ label, value, cn }, idx) => (
                  <div
                    className="d-flex align-items-center justify-content-between "
                    key={idx}
                    style={
                      label === " Add: FC"
                        ? { borderBottom: "1px solid #999" }
                        : null
                    }
                  >
                    <h6
                      className={`mb-0 text-right ${cn}`}
                      style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                    >
                      {label}:
                    </h6>

                    <div
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px dashed #999",
                        margin: "0 10px",
                      }}
                    />

                    <h6
                      className={`mb-0 text-right ${cn}`}
                      style={{ whiteSpace: "nowrap", fontWeight: 400 }}
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
                    {/* 
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
                      })} */}
                  </div>
                  <div
                    className="cashier-remittance-total d-flex align-items-center justify-content-between"
                    style={{
                      position: "absolute",
                      width: "94%",
                      borderTop: "1px dashed #999",
                      bottom: "0rem",
                    }}
                  >
                    <h6
                      className="mb-0 text-right font-weight-bold"
                      style={{
                        whiteSpace: "nowrap",
                        color: isRemitted ? "inherit" : "green", // 🟢 Green only for COH, regular if remitted
                      }}
                      title="Sales + Floating Cash - Expenses"
                    >
                      {isRemitted ? "Remitted" : "COH"}:
                    </h6>
                    <h6 className="mt-1" style={{ fontWeight: 400 }}>
                      {currency(net)}
                    </h6>
                  </div>
                </div>
              )}
            </div>

            {!isFuture && !isRemitted && deals.length > 0 && (
              <Footer num={num} item={item} deals={deals} />
            )}
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
