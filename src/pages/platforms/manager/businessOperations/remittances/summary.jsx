import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBBadge, MDBCard, MDBCardBody, MDBView } from "mdbreact";
import {
  currency,
  fullName,
  paymentMethod,
} from "../../../../../services/utilities";
import Month from "../../../../../services/fakeDb/calendar/months";
import SummaryLoading from "../../../cashier/cashRegistry/services/deals/summary/loading";
import "./style.css";
import { capitalize } from "lodash";
export default function Summary() {
  const {
    month,
    year,
    day: baseDay,
  } = useSelector(({ remittances }) => remittances);
  const { collections, isLoading } = useSelector(({ deals }) => deals);
  const [selectedCashier, setSelectedCashier] = useState("");
  const [day, setDay] = useState(1);

  const currentDate = new Date(year, month - 1, day);
  const activeDate = `${Month[month - 1]} ${day}, ${year}`;
  const isSunday = currentDate.getDay() === 0;

  useEffect(() => {
    setDay(baseDay);
  }, [baseDay]);

  useEffect(() => {
    setDay(new Date().getDate());
  }, []);

  const cashierSales = useMemo(() => {
    const salesMap = {};
    const deletedCashiers = new Set();
    setSelectedCashier("");

    collections.forEach(({ cashierId, amount, createdAt, deletedAt }) => {
      if (!cashierId || !createdAt) return;
      const createdDate = new Date(createdAt);

      if (
        createdDate.getDate() === day &&
        createdDate.getMonth() === month - 1 &&
        createdDate.getFullYear() === year
      ) {
        const cashierKey = cashierId._id;

        if (deletedAt) {
          deletedCashiers.add(cashierKey);
          return;
        }

        if (!salesMap[cashierKey]) {
          salesMap[cashierKey] = {
            id: cashierId._id,
            name: cashierId?.alias || cashierId?.fullName?.fname,
            gross: 0,
            isDeleted: false,
          };
        }
        salesMap[cashierKey].gross += amount;
      }
    });

    deletedCashiers.forEach((id) => {
      if (!salesMap[id]) {
        salesMap[id] = {
          id,
          name: "Deleted Cashier",
          gross: 0,
          isDeleted: true,
        };
      }
    });

    return Object.values(salesMap).sort((a, b) => b.gross - a.gross);
  }, [collections, day, month, year]);

  const showCashierSelect = cashierSales.length > 0;
  const isOnlyOneCashier = cashierSales.length === 1;

  const { cluster, total } = useMemo(() => {
    const filtered =
      collections?.filter(({ createdAt, cashierId }) => {
        if (!createdAt) return false;
        const createdDate = new Date(createdAt);

        const matchesDate =
          createdDate.getDate() === day &&
          createdDate.getMonth() === month - 1 &&
          createdDate.getFullYear() === year;

        const matchesCashier = selectedCashier
          ? cashierId?._id === selectedCashier
          : true;

        return matchesDate && matchesCashier;
      }) || [];

    console.log("filtered", filtered);

    const totalAmount = filtered.reduce((sum, { amount, deletedAt }) => {
      if (deletedAt) return sum;
      return sum + amount;
    }, 0);

    return { cluster: filtered, total: totalAmount };
  }, [day, month, year, collections, selectedCashier]);

  console.log("cluster", cluster);

  const handlePaymentIcon = (method) => {
    const { img, style, text } = paymentMethod.getImage(method);
    return <img src={img} style={style} title={text} />;
  };
  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className="gradient-card-header custom-header bg-success narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
      >
        <div className="d-flex justify-content-between items-center font-bold text-lg w-100">
          <span
            className={
              isSunday ? "text-red-600 text-sm" : "text-gray-600 text-sm"
            }
          >
            {new Date(activeDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-end">SUMMARY</span>
        </div>
      </MDBView>
      <MDBCardBody className="m-0 p-1">
        <div
          className="flex justify-between items-center"
          style={{ width: "18rem" }}
        >
          {/* Only show cashier selection if there's more than one */}
          {!isLoading ? (
            <div>
              <div
                className="d-flex flex-align-items-center"
                style={{
                  position: "sticky",
                  zIndex: 2,
                  opacity: showCashierSelect ? 1 : 0,
                  marginBottom: !showCashierSelect && "-4.5rem",
                }}
              >
                <label
                  className="text-sm font-semibold grey-text mt-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  Cashier:
                </label>
                <select
                  className="ml-2 border rounded p-1 w-100"
                  value={selectedCashier}
                  onChange={(e) => setSelectedCashier(e.target.value)}
                >
                  {cashierSales.length > 1 && (
                    <option value="">All Cashiers</option>
                  )}
                  {cashierSales.map(({ id, name, gross, isDeleted }) => (
                    <option
                      key={id}
                      value={id}
                      className={isDeleted ? "text-red-600" : ""}
                    >
                      {`${name} ${
                        selectedCashier !== id && !isOnlyOneCashier
                          ? `- ${currency(gross)}`
                          : ""
                      }`}
                    </option>
                  ))}
                </select>
              </div>
              <hr />
              <div className="d-flex justify-between align-items-center w-full">
                <p className="font-bold flex-1 text-left">
                  {cluster.length} Patient/s
                </p>
                <p className="font-bold flex-1 text-right">{`Total: ${currency(
                  total
                )}`}</p>
              </div>
              {cluster.length > 0 ? (
                <div
                  style={{ maxHeight: "40rem", overflowY: "auto" }}
                  className="summary-scrollbar "
                >
                  <ol className="mt-2 list-decimal list-inside">
                    {cluster.map(
                      (
                        {
                          customerId,
                          amount,
                          createdAt,
                          cart,
                          deletedAt,
                          payment,
                        },
                        index
                      ) => (
                        <li key={index} className="p-2 border-b">
                          <div
                            className="font-bold"
                            style={{
                              color: deletedAt ? "red" : "inherit",
                            }}
                          >
                            {fullName(
                              customerId?.fullName || "Unknown Customer"
                            )}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {new Date(createdAt).toLocaleTimeString()}
                          </div>
                          <div className="text-blue-600">
                            {currency(amount)} {deletedAt ? "(Deleted)" : ""}{" "}
                            {handlePaymentIcon(payment)}
                          </div>
                          <div className="text-blue-600">
                            {cart.map((i, index) => (
                              <MDBBadge key={i.id ?? index} color="primary">
                                {i?.menuId?.abbreviation}
                              </MDBBadge>
                            ))}
                          </div>
                        </li>
                      )
                    )}
                  </ol>
                </div>
              ) : (
                <p className="text-gray-500 mt-5 text-center">
                  No collections found for this date.
                </p>
              )}
            </div>
          ) : (
            <div style={{ width: "18rem" }}>
              <SummaryLoading rowCount={10} />
            </div>
          )}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}
