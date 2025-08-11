import React from "react";
import "swiper/css";
import "./style.css";
import DiagnosticsSubs from "./diagnosticsSubs";
import SuppliersSubs from "./suppliersSubs";

export default function Affiliates() {
  return (
    <div className="homePage-affiliates">
      <div className="subscriber-bg-img">
        <div className="subscriber-bg-mask" />
      </div>
      <DiagnosticsSubs />
      <SuppliersSubs />
    </div>
  );
}
