import React, { useState, useEffect } from "react";
import Header from "./header";
import { MDBAlert } from "mdbreact";
import { formColor, Banner } from "../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import Signatories from "./signatories";

const Printout = ({ task }) => {
  const {
    category,
    branchId,
    patient,
    updatedAt,
    source,
    referral,
    form,
    remarks,
    signatories,
  } = task;

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
      <div
        style={{
          width: "1050px",
          height: "624px",
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "18px",
        }}
      >
        <>
          <Banner company={branchId.companyId.name} branch={branchId.name} />
          <Header
            patient={patient}
            date={updatedAt}
            source={source}
            category={category}
            task={task}
            referral={referral}
          />
          <MDBAlert
            color={formColor(form)}
            className="text-uppercase text-center py-0 mb-1"
          >
            <h5 style={{ letterSpacing: "30px" }} className="mb-0 fw-bold">
              {form}
            </h5>
          </MDBAlert>
          <BodySwitcher task={task} />
          <div className="px-1 border-bottom border-primary d-flex">
            <div style={{ paddingTop: "2px" }} className="mr-1">
              Remarks:
            </div>
            <h5 className="fw-bold">{remarks}</h5>
          </div>
          <Signatories signatories={signatories} />
        </>
      </div>
    </div>
  );
};

export default function TaskPrintout() {
  const [task, setTask] = useState({ _id: "" });

  useEffect(() => {
    setTask(JSON.parse(localStorage.getItem("taskPrintout")));
  }, []);

  if (task?._id) return <Printout task={task} />;

  return <div>Task is Empty</div>;
}
