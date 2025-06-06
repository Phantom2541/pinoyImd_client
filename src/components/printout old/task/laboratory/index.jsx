import React, { useEffect, useState } from "react";
import Header from "./header";
import { Banner } from "../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import Signatories from "./signatories";
import "../../printout.css";

export default function LabTaskPrintout() {
  const [task, setTask] = useState({ _id: "" });

  useEffect(() => {
    const savedTask = JSON.parse(localStorage.getItem("taskPrintout"));
    setTask(savedTask);

    // Delay to ensure content is rendered before print
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  const { companyId, name } = task?.branchId || {};

  return (
    <div className="print-container position-relative" id="printableArea">
      <Banner company={companyId?.name} branch={name} />
      <div className="print-body">
        <Header task={task} />
        <BodySwitcher task={task} />
        <div className="flex-spacer" />
      </div>
      <div className="remarks-section d-flex px-1">
        <div style={{ paddingTop: "2px" }} className="mr-1 mb-1">
          Remarks:
        </div>
        <h5 className="fw-bold">{task?.remarks}</h5>
      </div>
      <Signatories signatories={task?.signatories} form={task?.form} />
    </div>
  );
}
