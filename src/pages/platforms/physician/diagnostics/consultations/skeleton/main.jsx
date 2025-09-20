import React from "react";
import "./style.css";

export default function Skeleton() {
  return (
    <div className="checkup-data-skeleton">
      <div className="checkup-data-skeleton-body"></div>
      <div className="checkup-data-skeleton-sidebar"></div>
      <div className="checkup-data-skeleton-note"></div>
      <div className="checkup-data-skeleton-case"></div>
    </div>
  );
}
