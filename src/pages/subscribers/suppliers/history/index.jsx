import React, { useEffect, useRef, useState } from "react";
import "./style.css";

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

      // Remove "active" class from all rows
      rows.forEach((row) => row.classList.remove("active"));

      // Add "active" only to the closest one
      if (closestRow) {
        closestRow.classList.add("active");

        // Update the line to reach that row
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
        <div className="supplier-history-row">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            nobis beatae obcaecati numquam animi ipsa asperiores ipsum
            perferendis, earum error atque tempora voluptates non ipsam quod
            reprehenderit minima possimus dolores?
          </div>
          <div></div>
        </div>
        <div className="supplier-history-row">
          <div></div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            nobis beatae obcaecati numquam animi ipsa asperiores ipsum
            perferendis, earum error atque tempora voluptates non ipsam quod
            reprehenderit minima possimus dolores?
          </div>
        </div>
        <div className="supplier-history-row">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            nobis beatae obcaecati numquam animi ipsa asperiores ipsum
            perferendis, earum error atque tempora voluptates non ipsam quod
            reprehenderit minima possimus dolores?
          </div>
          <div></div>
        </div>
        <div className="supplier-history-row">
          <div></div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            nobis beatae obcaecati numquam animi ipsa asperiores ipsum
            perferendis, earum error atque tempora voluptates non ipsam quod
            reprehenderit minima possimus dolores?
          </div>
        </div>
        <div className="supplier-history-row">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            nobis beatae obcaecati numquam animi ipsa asperiores ipsum
            perferendis, earum error atque tempora voluptates non ipsam quod
            reprehenderit minima possimus dolores?
          </div>
          <div></div>
        </div>
        <div className="supplier-history-row">
          <div></div>
          <div>
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            nobis beatae obcaecati numquam animi ipsa asperiores ipsum
            perferendis, earum error atque tempora voluptates non ipsam quod
            reprehenderit minima possimus dolores?
          </div>
        </div>
      </div>
    </div>
  );
}
