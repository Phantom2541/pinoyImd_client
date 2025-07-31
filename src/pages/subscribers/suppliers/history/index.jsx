import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import historyData from "./collection";

export default function History() {
  const lineRef = useRef(null);
  const containerRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rows = containerRef.current.querySelectorAll(
        ".supplier-history-row"
      );
      const viewportCenter = window.innerHeight / 2;

      let closestRow = null;
      let minDistance = Infinity;

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestRow = row;
        }
      });

      rows.forEach((row) => row.classList.remove("active"));
      if (closestRow) {
        closestRow.classList.add("active");
        const rect = closestRow.getBoundingClientRect();
        const offsetTop = closestRow.offsetTop + rect.height / 2;
        setLineHeight(offsetTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="supplier-history-section">
      <div className="supplier-history-title">
        <h1>Our Journey</h1>
      </div>
      <div className="supplier-history-container" ref={containerRef}>
        <div
          className="supplier-history-line"
          ref={lineRef}
          style={{ height: `${lineHeight}px` }}
        >
          <div className="supplier-history-circle" />
        </div>

        {historyData.map((text, index) => (
          <div key={index} className="supplier-history-row">
            <div>{index % 2 === 0 ? text : null}</div>
            <div>{index % 2 !== 0 ? text : null}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
