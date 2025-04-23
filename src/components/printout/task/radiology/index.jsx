import React, { useState, useEffect } from "react";
import Header from "./header";
import { Banner } from "../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import Signatories from "./signatories";
import "../../printout.css";

const Printout = ({ task }) => {
  const { branchId, remarks, signatories } = task;

  return (
    <div className="print-container">
      <Banner company={branchId.companyId.name} branch={branchId.name} />
      <div className="print-body">
        <Header task={task} />
        <BodySwitcher task={task} />
        {/* Spacer pushes Remarks to bottom */}
        <div className="flex-spacer" />

        <div className="remarks-section d-flex px-1">
          <div style={{ paddingTop: "2px" }} className="mr-1 mb-1">
            Remarks:
          </div>
          <h5 className="fw-bold">{remarks}</h5>
        </div>
      </div>
      <Signatories signatories={signatories} />
    </div>
  );
};

export default function RadTaskPrintout() {
  const [task, setTask] = useState({ _id: "" });
  useEffect(() => {
    const savedTask = JSON.parse(localStorage.getItem("taskPrintout"));
    setTask(savedTask);

    // Delay to ensure content is rendered before print
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  if (task?._id) return <Printout task={task} />;

  return <div>Task is Empty</div>;
}
