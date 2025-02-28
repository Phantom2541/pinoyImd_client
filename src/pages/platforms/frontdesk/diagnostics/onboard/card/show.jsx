import React from "react";
import { fullName } from "../../../../../../services/utilities";

const Show = ({ source, physicianId }) => {
  return (
    <div>
      <div className="sales-card-info">
        <small>Source</small>
        <span className="ellipse">{source?.name || "walk in"}</span>
      </div>
      <div className="sales-card-info">
        <small>Referral</small>
        <span className="ellipse">{fullName(physicianId?.fullName)}</span>
      </div>
    </div>
  );
};

export default Show;
