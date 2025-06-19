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
    <div className="laboratory-container ">
      <Banner
        company={branchId.companyId.name}
        branch={branchId.name}
        className="laboratory-banner"
      />
      <div className="laboratory-body">
        <Header task={task} />
        <BodySwitcher task={task} />
        <div className="flex-spacer" />
      </div>
      <div className="laboratory-remarks d-flex px-1">
        <div style={{ paddingTop: "2px" }} className="mr-1 mb-1">
          Remarks:
        </div>
        <h5 className="fw-bold">{remarks}</h5>
      </div>
      <div className="laboratory-footer">
        <Signatories signatories={signatories} />
        <Footer />
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
