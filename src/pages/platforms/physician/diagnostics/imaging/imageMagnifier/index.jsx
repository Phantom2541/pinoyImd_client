import React from "react";
import "./style.css";
import XRAY from "../.././../../../assets/x-ray sample.jpg";

import ImgMagnifier from "./imgMagnifier";

export default function ParentComponent() {
  return (
    <div className="template-x-ray-section">
      <ImgMagnifier src={XRAY} />
    </div>
  );
}
