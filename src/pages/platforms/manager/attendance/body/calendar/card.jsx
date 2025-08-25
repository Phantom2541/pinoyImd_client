import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Indicator from "./indicator";
import { SetActiveDATE, SetActiveEmployee } from "../../../../../../services/redux/slices/market/attendances";

const Card = ({ txt, num, items = [], summaryRef, lastAnimatedCard, setLastAnimatedCard }) => {
  const { activeDate, activeEmployee } = useSelector(({ attendances }) => attendances);
  const dispatch = useDispatch();

  const today = new Date();
  const dateCell = new Date();
  dateCell.setDate(num);
  dateCell.setMonth(new Date().getMonth());
  dateCell.setFullYear(new Date().getFullYear());

  const isToday = dateCell.toDateString() === today.toDateString();
  const isSunday = dateCell.getDay() === 0;

  const handleDate = () => {
    dispatch(SetActiveDATE(num));
    dispatch(SetActiveEmployee(null)); // reset employee when date changes
  };

  const presentCount = items.filter((i) => i.status === "Present").length;

  // Dynamic styles
  let bgColor = "bg-blue-100";
  if (isToday) bgColor = "bg-green-200";
  else if (isSunday) bgColor = "bg-red-200";

  return (
    <div
      className={`calendar-card ${bgColor} ${num ? "cursor-pointer" : "opacity-0 pointer-events-none"} ${activeDate === Number(num) ? "active" : ""}`}
      onClick={(e) => {
        if (items.length > 0)
          flyToSummary(e, Number(num), summaryRef, lastAnimatedCard, setLastAnimatedCard);
        handleDate();
      }}
    >
      <Indicator activeCell={activeDate === Number(num)} num={num} isFuture={dateCell > today} />

      <div className="attendance-card-body">
        {items.length > 0 ? (
          <>
            <strong>
              {presentCount}/{items.length} present
            </strong>
            <div className="attendance-details mt-1">
              {items.map((rec, i) => (
                <div
                  key={rec._id || i}
                  className={`d-flex justify-content-between small border-bottom py-1 cursor-pointer ${activeEmployee?.employeeName === rec.employeeName ? "bg-yellow-200" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering date click
                    dispatch(SetActiveEmployee(rec));
                  }}
                >
                  <span className="font-weight-bold">
                    {rec.employeeName || rec.user?.name || "Unknown"}
                  </span>
                  <span>
                    AM: {rec.amIn || "-"} - {rec.amOut || "-"} | PM: {rec.pmIn || "-"} - {rec.pmOut || "-"} ({rec.status})
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-muted small text-center">No records</div>
        )}
      </div>
    </div>
  );
};

export default Card;

// ===== Fly-to-summary function =====
const flyToSummary = (e, currentCardNum, summaryRef, lastAnimatedCard, setLastAnimatedCard) => {
  const current = Number(currentCardNum);
  if (lastAnimatedCard === current) return;
  setLastAnimatedCard(current);

  const source = e.currentTarget;
  const target = summaryRef?.current;
  if (!source || !target) return;

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

  setTimeout(() => clone.remove(), 1000);
};
