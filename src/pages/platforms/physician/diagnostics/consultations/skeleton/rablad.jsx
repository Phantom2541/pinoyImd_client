import React from "react";
import "./style.css";

export default function LabRadSkeleton() {
  return (
    <div className="d-flex w-100" style={{ gap: "1rem" }}>
      {/* Left side main skeleton */}
      <div className="checkup-data-lab-skeleton">
        {/* Header */}
        <div className="checkup-data-skeleton-box checkup-data-lab-skeleton-header"></div>

        {/* Patient Info */}
        <div className="checkup-data-lab-skeleton-info">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="checkup-data-skeleton-box"></div>
          ))}
        </div>

        {/* Section: Urinalysis Title */}
        <div className="checkup-data-skeleton-box checkup-data-lab-skeleton-section-title"></div>

        {/* Physical Examination */}
        <div className="checkup-data-skeleton-box checkup-data-lab-skeleton-section-title"></div>
        <div className="checkup-data-lab-skeleton-table">
          {Array.from({ length: 3 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="checkup-data-skeleton-box"></div>
              <div className="checkup-data-skeleton-box"></div>
            </React.Fragment>
          ))}
        </div>

        {/* Chemical Examination */}
        <div className="checkup-data-skeleton-box checkup-data-lab-skeleton-section-title"></div>
        <div className="checkup-data-lab-skeleton-table">
          {Array.from({ length: 7 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="checkup-data-skeleton-box"></div>
              <div className="checkup-data-skeleton-box"></div>
            </React.Fragment>
          ))}
        </div>

        {/* Microscopic Examination */}
        <div className="checkup-data-skeleton-box checkup-data-lab-skeleton-section-title"></div>
        <div className="checkup-data-lab-skeleton-table">
          {Array.from({ length: 6 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="checkup-data-skeleton-box"></div>
              <div className="checkup-data-skeleton-box"></div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right side sidebar skeleton */}
      <div className="checkup-data-lab-skeleton-sidebar">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="checkup-data-skeleton-box checkup-data-lab-skeleton-sidebar-item"
          ></div>
        ))}
      </div>
    </div>
  );
}
