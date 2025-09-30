import React from "react";
import { useSelector } from "react-redux";
import { billingAddress } from "../../../../../../../services/utilities";

export default function Footer() {
  const { activePlatform } = useSelector(({ auth }) => auth);
  return (
    <div className="checkup-data-prescription-card-footer">
      <span>{activePlatform.branch.companyId.name}</span>
      <span>{billingAddress(activePlatform.branch.address)}</span>
    </div>
  );
}
