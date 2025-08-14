import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Indicator from "./indicator";
import { currency, fullName } from "../../../../../../../services/utilities";
import {
  SetActiveDATE,
  SetSELECTED,
} from "../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { capitalize } from "lodash";
import Swal from "sweetalert2";

const Card = ({
  txt,
  num,
  items = [],
  summaryRef,
  lastAnimatedCard,
  setLastAnimatedCard,
}) => {
  const { isLoading, day } = useSelector(({ remittances }) => remittances);
  const [activeCell, setActiveCell] = useState(false);
  const dispatch = useDispatch();

  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);
  const isToday = dateCell.toDateString() === today.toDateString();

  console.log("items", items);

  useEffect(() => {
    setActiveCell(day === Number(num));
  }, [day, num]);

  const totalGross = items.reduce((sum, { gross }) => sum + (gross || 0), 0);

  const handleRemittance = (_id) => {
    const selected = items.find(({ _id: id }) => id === _id);
    const { cashier } = selected;

    if (!selected?.closing) {
      return Swal.fire({
        title: `<span class="swal-small-title">${fullName(
          cashier.fullName
        )}</span>`,
        text: "is not yet ready for remittance.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }

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

  return (
    <div
      className={`calendar-card  ${isToday && "today"}  ${
        num ? "cursor-pointer" : "opacity-0 pointer-events-none"
      } ${activeCell && "active"} `}
      style={!num ? { opacity: 0, pointerEvents: "none" } : {}}
      onClick={(e) => {
        if (items.length > 0) {
          flyToSummary(
            e,
            Number(num),
            summaryRef,
            lastAnimatedCard,
            setLastAnimatedCard
          ); // ✅ always a number
        }
        handleDate();
      }}
    >
      <Indicator
        activeCell={activeCell}
        num={num}
        week={week}
        isFuture={isFuture}
      />
      <h6 style={{ width: "10rem", opacity: 0, marginBottom: "-1.3rem" }}>.</h6>

      {!isLoading ? (
        <div className="sales-card-body">
          <div className="d-flex flex-column">
            {items.map(
              (
                {
                  cashier,
                  sales,
                  collector,
                  _id,
                  breakdown,
                  coh,
                  expenses,
                  opening,
                },
                i
              ) =>
                sales > 0 && (
                  <div
                    key={i}
                    data-id={_id}
                    className={`manager-remmitance-info mb-1 d-flex justify-content-between ${
                      !collector ? "clickable" : ""
                    }`}
                    onClick={() => collector || handleRemittance(_id)}
                    title={handleTitle(
                      cashier,
                      breakdown,
                      sales,
                      expenses,
                      opening?.sum
                    )}
                    style={{ position: "relative", zIndex: 999 }}
                  >
                    {cashier?.alias || cashier?.fullName?.fname}
                    <span
                      className={`${
                        collector ? "" : "manager-remmitance-price"
                      }`}
                    >
                      {currency.format(coh)}
                      {!collector && <i className="fas fa-angle-right ml-2" />}
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
        <div className="mt-3">Loading...</div>
      )}
    </div>
  );
};

export default Card;

const flyToSummary = (
  e,
  currentCardNum,
  summaryRef,
  lastAnimatedCard,
  setLastAnimatedCard
) => {
  const current = Number(currentCardNum);

  // ✅ Skip animation only if SAME card was the last clicked
  if (lastAnimatedCard === current) return;

  setLastAnimatedCard(current); // ✅ update last animated card

  const source = e.currentTarget;
  const target = summaryRef?.current;

  if (!source || !target) {
    console.warn("Missing source or target");
    return;
  }

  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const clone = source.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.top = `${sourceRect.top}px`;
  clone.style.left = `${sourceRect.left}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.zIndex = 9999;
  clone.style.transition = "all 0.6s ease-in-out, opacity 1s ease-in";
  clone.style.pointerEvents = "none";
  clone.style.opacity = "1";
  clone.style.background = "white";
  clone.style.borderRadius = "10px";
  clone.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  clone.classList.add("fly-animation-clone");

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.top = `${targetRect.top}px`;
    clone.style.left = `${targetRect.left}px`;
    clone.style.width = `${targetRect.width}px`;
    clone.style.height = `${targetRect.height}px`;
    clone.style.opacity = "0";
  });

  setTimeout(() => {
    clone.remove();
  }, 1000);
};

const handleTitle = (cashier, breakdown, sales, expenses, fc = 0) => {
  if (!breakdown) return fullName;

  const details = Object.entries(breakdown)
    .map(([key, value]) => `->${capitalize(key)}: ${currency.format(value)}`)
    .join("\n ");

  let result = `Sales: ${currency.format(sales)}\nBreakdown:\n${details}`;

  if (fc) {
    result += `\nFloating Cash: ${currency.format(fc)}`;
  }

  if (expenses) {
    result += `\n- Expenses: ${currency.format(expenses)}`;
  }

  result += `\n----------\nBy: ${fullName(cashier.fullName)}`;

  return result;
};
