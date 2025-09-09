import React from "react";
import PROFILE from "./../../../assets/male.jpg";

export default function Patient() {
  return (
    <div className="checkup-data-patient">
      <div className="checkup-data-patient-info">
        <img
          src={PROFILE}
          alt="avatar"
          className="checkup-data-patient-profile"
          draggable={false}
        />
        <span>john kevin pajarillaga magtalas</span>
      </div>
    </div>
  );
}
