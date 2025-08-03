import React, { useState, useEffect, useRef } from "react";
import Header from "./header";
import { Banner } from "../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import Signatories from "./signatories";
import "../../printout.css";
import Footer from "./footer";
import "./style.css";

const tableRows = 22;

const Printout = ({ task }) => {
  const { branchId, remarks, signatories } = task;
  const hiddenTableRef = useRef();
  const [chunks, setChunks] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);

  // Detect printing (Ctrl+P or window.print)
  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // Prepare chunks only when printing
  useEffect(() => {
    if (isPrinting && hiddenTableRef.current) {
      const rows = hiddenTableRef.current.querySelectorAll("tbody tr");
      const rowArray = Array.from(rows);

      const newChunks = [];
      for (let i = 0; i < rowArray.length; i += tableRows) {
        newChunks.push(
          rowArray.slice(i, i + tableRows).map((row) => row.outerHTML)
        );
      }
      setChunks(newChunks);
    }
  }, [isPrinting, task]);

  return (
    <div>
      {/* Hidden BodySwitcher for extracting rows */}
      <div
        ref={hiddenTableRef}
        style={{ position: "absolute", visibility: "hidden", top: "-9999px" }}
      >
        <BodySwitcher task={task} />
      </div>

      {!isPrinting ? (
        // Normal View (Single BodySwitcher)
        <div className="laboratory-container">
          <Banner
            company={branchId.companyId.name}
            branch={branchId.name}
            className="laboratory-banner"
          />

          <div className="laboratory-body">
            <Header task={task} />
            <BodySwitcher task={task} />
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
      ) : (
        // Print View (Chunked Table)
        chunks.map((chunk, i) => (
          <div
            key={i}
            style={{
              pageBreakAfter: i === chunks.length - 1 ? "auto" : "always",
            }}
          >
            <div className="laboratory-container">
              <Banner
                company={branchId.companyId.name}
                branch={branchId.name}
                className="laboratory-banner"
              />

              <div className="laboratory-body">
                <Header task={task} />

                <table
                  className="mb-0 text-center tablePrintout"
                  border="1"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th
                        rowSpan={2}
                        className="py-0 text-left fw-bold align-middle text-center"
                      >
                        Service
                      </th>
                      <th className="text-center py-0 fw-bold" colSpan={2}>
                        Conventional Unit
                      </th>
                      <th className="text-center py-0 fw-bold" colSpan={2}>
                        System International Unit
                      </th>
                    </tr>
                    <tr>
                      <th className="py-0 fw-bold">Result</th>
                      <th className="py-0 fw-bold">Reference</th>
                      <th className="py-0 fw-bold">Result</th>
                      <th className="py-0 fw-bold">Reference</th>
                    </tr>
                  </thead>
                  <tbody dangerouslySetInnerHTML={{ __html: chunk.join("") }} />
                </table>
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
          </div>
        ))
      )}
    </div>
  );
};

export default function LabTaskPrintout() {
  const [task, setTask] = useState({ _id: "" });

  useEffect(() => {
    setTask(JSON.parse(localStorage.getItem("taskPrintout")));

    // 🔹 Pagka-load ng page, automatic magpi-print
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  if (task?._id) return <Printout task={task} />;
  return <div>Task is Empty</div>;
}
