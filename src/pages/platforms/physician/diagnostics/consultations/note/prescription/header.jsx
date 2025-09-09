import React from "react";
import LOGO from "./../../../../../../../assets/iMD.png";

export default function Header() {
  return (
    <div className="checkup-data-prescription-card-header">
      <img
        alt="logo"
        src={LOGO}
        className="checkup-data-prescription-card-logo"
      />
      <div className="checkup-data-prescription-card-info">
        <div className="checkup-data-prescrption-card-fullname">
          <span>Dr. Carl Magtalas</span>
          <small>MSIT,RN,RMP,FCPS</small>
        </div>
        <div className="checkup-data-prescription-card-contact">
          <span>+63 927 342 2159</span>
          <span>sample@gmail.com</span>
          <span>www.PinoyiMD.com</span>
        </div>
      </div>
    </div>
  );
}
