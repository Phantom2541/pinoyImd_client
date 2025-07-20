import React from "react";
import BANNER from "./../../../../assets/banner.png";

export default function Header() {
  return (
    <div className="organization-chart-imgContainer">
      <img className="organization-chart-img" src={BANNER} alt="banner" />
    </div>
  );
}
