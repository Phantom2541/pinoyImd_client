import React from "react";
import "./style.css";

export default function ID({ frontImage, backImage, layout, placedValues }) {
  return (
    <div className={`id-generator-container`}>
      <div className={`id-generator-preview-wrapper ${layout || "landscape"}`}>
        <div className={`id-generator-preview ${layout || "landscape"}`}>
          {frontImage && <img src={frontImage} alt="front preview" />}
        </div>
        <div className={`id-generator-preview ${layout || "landscape"}`}>
          {backImage && <img src={backImage} alt="back preview" />}
        </div>
      </div>
    </div>
  );
}
