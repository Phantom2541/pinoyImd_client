import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Indicator from "./indicator";
import { SetActiveDATE } from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";

const Card = ({ txt, num, items = [], summaryRef, lastAnimatedCard, setLastAnimatedCard }) => {
  const { day } = useSelector(({ remittances }) => remittances);
  const [activeCell, setActiveCell] = useState(false);
  const [expanded, setExpanded] = useState(false); // toggle names/details
  const dispatch = useDispatch();

  const today = new Date();
  const dateCell = new Date(txt);
  const isToday = dateCell.toDateString() === today.toDateString();

  useEffect(() => {
    setActiveCell(day === Number(num));
  }, [day, num]);

  const handleDate = () => dispatch(SetActiveDATE(num));
  const toggleExpand = () => setExpanded(!expanded);

  const presentCount = items.filter((i) => i.status === "Present").length;

  return (
    <div
      className={`calendar-card ${isToday ? "today" : ""} ${num ? "cursor-pointer" : "opacity-0 pointer-events-none"} ${activeCell ? "active" : ""}`}
      style={!num ? { opacity: 0, pointerEvents: "none" } : {}}
      onClick={(e) => {
        if (items.length > 0) flyToSummary(e, Number(num), summaryRef, lastAnimatedCard, setLastAnimatedCard);
        handleDate();
      }}
    >
      {/* Indicator (week/day on top) */}
      <Indicator activeCell={activeCell} num={num} isFuture={dateCell > today} />

      {/* Attendance summary */}
      <div className="attendance-card-body">
        <div className="d-flex justify-content-between align-items-center">
          <strong>{presentCount}/{items.length} present</strong>
          {items.length > 0 && (
            <button className="btn btn-sm btn-link" onClick={toggleExpand}>
              {expanded ? "Hide" : "Show"}
            </button>
          )}
        </div>

        {expanded && items.length > 0 && (
          <div className="attendance-details mt-1">
            {items.map((rec, i) => (
              <div key={i} className="d-flex justify-content-between small">
                <span>{rec.employee?.name || "Unknown"}</span>
                <span>
                  {rec.amIn || "-"}-{rec.amOut || "-"} / {rec.pmIn || "-"}-{rec.pmOut || "-"} ({rec.status})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;

// Fly-to-summary animation (unchanged)
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
