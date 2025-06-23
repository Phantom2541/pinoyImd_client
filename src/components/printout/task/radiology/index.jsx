import { useState, useEffect } from "react";
import Header from "./header";
import { Banner } from "../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import Signatories from "./signatories";
import "../../printout.css";
import Footer from "./footer";
import "./style.css";
const Printout = ({ task }) => {
  const { branchId, remarks, signatories } = task;

  return (
    <div className="radiology-container">
      <Banner
        company={branchId.companyId.name}
        branch={branchId.name}
        className="radiology-banner"
      />
      <div className="radiology-body">
        <Header task={task} />
        <BodySwitcher task={task} />
        <div className="flex-spacer" />
      </div>

      <div className="radiology-footer">
        <div className="radiology-remarks d-flex mb-3 mx-5">
          <div style={{ paddingTop: "2px" }} className="mr-1 mb-1">
            Remarks:
          </div>
          <h5 className="fw-bold">{remarks}</h5>
        </div>
        <Signatories signatories={signatories} />
        {task?.isDuplicate && (
          <h6 style={{ marginTop: "-2rem", fontWeight: 400 }} className="ml-2">
            Duplicate Copy
          </h6>
        )}
        <Footer dealId={task?._id} />
      </div>
    </div>
  );
};

export default function LabTaskPrintout() {
  const [task, setTask] = useState({ _id: "" });

  useEffect(() => {
    setTask(JSON.parse(localStorage.getItem("taskPrintout")));
    // Delay to ensure content is rendered before print
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  if (task?._id) return <Printout task={task} />;

  return <div>Task is Empty</div>;
}
