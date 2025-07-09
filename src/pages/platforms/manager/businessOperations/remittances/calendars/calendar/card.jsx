import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Indicator from "./indicator";
import { currency, fullName } from "../../../../../../../services/utilities";
import {
  SetActiveDATE,
  SetSELECTED,
} from "../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { capitalize } from "lodash";
import { MDBAnimation, MDBProgress } from "mdbreact";
import Swal from "sweetalert2";
const Card = ({ txt, num, index, items = [] }) => {
  const { isLoading } = useSelector(({ remittances }) => remittances);
  const dispatch = useDispatch();
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);

  const isToday = dateCell.toDateString() === today.toDateString();
  // Compute total gross
  const totalGross = items.reduce((sum, { gross }) => sum + (gross || 0), 0);
  const handleRemittance = (_id) => {
    const selected = items.find(({ _id: id }) => id === _id);
    const { cashier } = selected;
    if (!selected?.closing)
      return Swal.fire({
        title: `<span class="swal-small-title">${fullName(
          cashier.fullName
        )}</span>`,
        text: "is not yet ready for remittance.",
        icon: "warning",
        confirmButtonText: "OK",
        showCancelButton: false,
        didOpen: () => {
          // Optional: add extra styles directly via JS
          const el = document.querySelector(".swal-small-title");
          if (el) el.style.fontSize = "25px";
        },
      });
    if (selected)
      dispatch(
        SetSELECTED({
          key: "remit",
          value: {
            ...selected,
            createdAtNow: dateCell.toISOString().slice(0, 10),
          },
        })
      );
  };

  const handleDate = () => dispatch(SetActiveDATE(num));

  const handleTitle = (cashier, breakdown) => {
    if (!breakdown) return fullName;

    const details = Object.entries(breakdown)
      .map(([key, value]) => `${capitalize(key)}: ${currency.format(value)}`)
      .join(", ");

    return `${fullName(cashier.fullName)}\n${details}`;
  };

  return (
    <div
      className={`calendar-card ${isToday && "today"}  ${
        num ? "cursor-pointer" : "opacity-0 pointer-events-none"
      }`}
      style={!num ? { opacity: 0, pointerEvents: "none" } : {}}
      key={`pos-calendar-${index}`}
      onClick={handleDate}
    >
      <Indicator num={num} week={week} isFuture={isFuture} />
      {/* wag icocomment itong h6 tag na ito para mamaintain yung 100% width  */}
      <h6 style={{ width: "10rem", opacity: 0, marginBottom: "-1.3rem" }}>.</h6>
      {!isLoading ? (
        <div className="sales-card-body">
          <div className="d-flex flex-column">
            {items.map(
              ({ cashier, sales: gross, collector, _id, breakdown }, i) =>
                gross > 0 && (
                  <div
                    key={i}
                    className="manager-remmitance-info mb-1 d-flex justify-content-between"
                    onClick={() => collector || handleRemittance(_id)}
                    title={handleTitle(cashier, breakdown)}
                    style={{ position: "relative", zIndex: 999 }}
                  >
                    {cashier?.alias || cashier?.fullName?.fname}
                    <span style={{ color: collector ? "" : "green" }}>
                      {currency.format(gross)}
                    </span>
                  </div>
                )
            )}
          </div>
          <hr />

          {totalGross > 0 && (
            <div className="manager-remmitance-total d-flex align-items-center text-end mt-2">
              <h6 className="title"> Gross:</h6>
              <strong> {currency.format(totalGross)}</strong>
            </div>
          )}
        </div>
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
  );
};

export default Card;
