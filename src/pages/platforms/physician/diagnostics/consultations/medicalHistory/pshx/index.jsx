import React, { useState, useEffect } from "react";
import "../style.css";
import DraggableList, { useDragAndDrop } from "../dragAndDrop";
import { useDispatch, useSelector } from "react-redux";
import { PSH } from "../../../../../../../services/redux/slices/diagnostics/cases";

export default function PSHx({ pastSurgicalHistory, patient }) {
  console.log("PSHx pastSurgicalHistory", pastSurgicalHistory);
  console.log("PSHx patient", patient);
  const { token } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ cases }) => cases);
  const [expanded, setExpanded] = useState(null);
  const dragDrop = useDragAndDrop(pastSurgicalHistory || []);
  const dispatch = useDispatch();

  useEffect(() => {
    if (patient && patient._id) {
      dispatch(PSH({ token, key: { pId: patient._id } }));
    }
  }, [patient, token, dispatch]);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  // Auto-sort by year (latest first)
  const sortedHistory = [...collections].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  if (!collections || collections.length === 0) {
    return (
      <div className="checkup-data-pmh-container">
        No past surgical history available.
      </div>
    );
  }

  return (
    <div className="checkup-data-mh-container">
      <div className="pshx-container">
        <h2 className="pshx-title">Past Surgical History</h2>
        <div className="pshx-timeline">
          {sortedHistory.map((surgery, index) => (
            <div
              key={index}
              className={`pshx-item ${expanded === index ? "expanded" : ""}`}
              onClick={() => toggleExpand(index)}
            >
              <div className="pshx-dot" />
              <div className="pshx-content">
                <div className="pshx-header">
                  <span className="pshx-procedure">{surgery.procedure}</span>
                  <span className="pshx-date">{surgery.year}</span>
                </div>
                <div
                  className={`pshx-body ${
                    expanded === index ? "show" : "hide"
                  }`}
                >
                  {surgery.hospital && (
                    <p>
                      <strong>Hospital:</strong> {surgery.hospital}
                    </p>
                  )}
                  {surgery.surgeon && (
                    <p>
                      <strong>Surgeon:</strong> {surgery.surgeon}
                    </p>
                  )}
                  {surgery.complication && (
                    <p className="pshx-complication">
                      <strong>Complication:</strong> {surgery.complication}
                    </p>
                  )}
                  {surgery.remarks && (
                    <p>
                      <strong>Remarks:</strong> {surgery.remarks}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
