import React, { useState, useEffect } from "react";
import Header from "./header";
import { Banner } from "../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import Signatories from "./signatories";
import "../../printout.css";
import Footer from "./footer";
import "./style.css";

function chunkArray(array, size) {
  const result = [];
  const entries = Object.entries(array);
  for (let i = 0; i < entries.length; i += size) {
    result.push(Object.fromEntries(entries.slice(i, i + size)));
  }
  return result;
}

const Printout = ({ task }) => {
  const { branchId, remarks, signatories, packages } = task;
  const chunks = chunkArray(packages, 23); // adjust row count per page here

  return (
    <div className="laboratory-container">
      {chunks.map((chunk, index) => (
        <div key={index} className="laboratory-page">
          <div className="laboratory-page-content">
            <Banner
              company={branchId.companyId.name}
              branch={branchId.name}
              className="laboratory-banner"
            />
            <div className="laboratory-body">
              <Header task={task} />
              <BodySwitcher task={{ ...task, packages: chunk, data:packages }} />
            </div>
          </div>

          <div className="laboratory-footer">
            <div className="laboratory-remarks d-flex px-1">
              <div style={{ paddingTop: "2px" }} className="mr-1 mb-1">
                <span className="ml-2">Remarks:</span>
              </div>
              <h5 className="fw-bold">{remarks}</h5>
            </div>
            <div className="laboratory-line" />
            <Signatories signatories={signatories} />
            {task?.isDuplicate && (
              <h6
                style={{ marginTop: "-2rem", fontWeight: 400 }}
                className="ml-2"
              >
                Duplicate Copy
              </h6>
            )}
            <Footer dealId={task?._id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function LabTaskPrintout() {
  const [task, setTask] = useState({ _id: "" });

  useEffect(() => {
    setTask(JSON.parse(localStorage.getItem("taskPrintout")));
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  if (task?._id) return <Printout task={task} />;

  return <div>Task is Empty</div>;
}
