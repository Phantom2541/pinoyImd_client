import Tracker from "../../tracker";
import { MDBCol, MDBRow } from "mdbreact";
import { useState, useEffect } from "react";
import Header from "./../../../../../../../../src/components/printout/task/laboratory/header";
import { Banner } from "../../../../../../../services/utilities";
import BodySwitcher from "../../../../../../../components/printout/task/laboratory/bodySwitcher";
import Signatories from "./../../../../../../../../src/components/printout/task/laboratory/signatories";
import "./printout.css";
import Footer from "./../../../../../../../../src/components/printout/task/laboratory/footer";
import "./style.css";

function chunkArray(array, size) {
  const result = [];
  const entries = Object.entries(array);
  for (let i = 0; i < entries.length; i += size) {
    result.push(Object.fromEntries(entries.slice(i, i + size)));
  }
  return result;
}

const Printout = ({ task, onloaded, setOnloaded }) => {
  const { branchId, remarks, signatories, packages } = task;
  const chunks = chunkArray(packages, 23); // adjust row count per page here
  return (
    <>
      <div className="laboratory-container">
        {chunks.map((chunk, index) => (
          <div key={index} className="laboratory-page">
            <div className="laboratory-page-content">
              <Banner
                company={branchId.companyId?.name}
                branch={branchId.name}
                bid={branchId?.bid || ""}
                onloaded={onloaded}
                setOnloaded={setOnloaded}
                className="laboratory-banner"
              />
              <div className="laboratory-body">
                <Header task={task} />
                <BodySwitcher
                  task={{ ...task, packages: chunk, data: packages }}
                />
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
    </>
  );
};

export default function Laboratory() {
  const [task, setTask] = useState({ _id: "" });
  const [onloaded, setOnloaded] = useState(false);

  useEffect(() => {
    setTask(JSON.parse(localStorage.getItem("taskPrintout")));
  }, []);
  console.log("laboratortask", task);

  if (task?._id)
    return (
      <MDBRow className="h-100">
        <MDBCol md="10" className="p-1">
          <div
            style={{
              maxHeight: "680px",
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            <Printout
              task={task}
              onloaded={onloaded}
              setOnloaded={setOnloaded}
            />
          </div>
        </MDBCol>
        <MDBCol md="2" className="p-1">
          <Tracker />
        </MDBCol>
      </MDBRow>
    );

  return (
    <MDBRow className="h-100">
      <MDBCol md="10" className="p-1">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh", // full viewport height
            fontSize: "3rem", // big text
            fontWeight: "bold",
            color: "#555", // subtle gray color
            textAlign: "center",
          }}
        >
          Laboratory Results is Empty
        </div>
      </MDBCol>
      <MDBCol md="2" className="p-1">
        <Tracker />
      </MDBCol>
    </MDBRow>
  );
}
