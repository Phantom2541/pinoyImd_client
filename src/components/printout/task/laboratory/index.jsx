import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "./header";
import { Banner } from "../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import Signatories from "./signatories";
import "../../printout.css";

export default function LabTaskPrintout() {
  const { selected } = useSelector(({ deals }) => deals),
    [task, setTask] = useState({ _id: "" });

  useEffect(() => {
    if (selected) {
      setTask(selected);
    }
  }, [selected]);

  const { branchId, remarks } = task;
  const { companyId, name } = branchId || {};

  console.log("branchId :", branchId);

  return (
    <div className="print-container position-relative" id="printableArea">
      <Banner company={companyId?.name} branch={name} />
      <div className="print-body">
        <Header />
        <BodySwitcher />
        <div className="flex-spacer" />
      </div>
      <div className="remarks-section d-flex px-1">
        <div style={{ paddingTop: "2px" }} className="mr-1 mb-1">
          Remarks:
        </div>
        <h5 className="fw-bold">{remarks}</h5>
      </div>
      <Signatories />
    </div>
  );
}
