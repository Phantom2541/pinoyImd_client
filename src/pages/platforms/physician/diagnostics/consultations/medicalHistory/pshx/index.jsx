import React, { useState, useEffect } from "react";
import "../style.css";
import DraggableList, { useDragAndDrop } from "../dragAndDrop";
import { useDispatch, useSelector } from "react-redux";
import { PSH } from "../../../../../../../services/redux/slices/diagnostics/cases";
import {
  capitalize,
  dateFormat,
} from "../../../../../../../services/utilities";
import { MDBIcon } from "mdbreact";

export default function PSHx({ pastSurgicalHistory, patient }) {
  const { token } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ cases }) => cases);
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const [expanded, setExpanded] = useState(null);
  const [surgicals, setSurgicals] = useState([]);
  const dragDrop = useDragAndDrop(pastSurgicalHistory || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const { cases = [] } = appointment || {};
    const _surgicals = cases.filter((c) => c.category === "surgical");
    setSurgicals(_surgicals);
  }, [appointment]);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  // Auto-sort by year (latest first)
  const sortedHistory = [...collections].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  if (!surgicals || surgicals.length === 0) {
    return (
      <div className="checkup-data-pmh-container d-flex justify-content-center">
        <div className="d-flex justify-content-center mb-3">
          <h3 className="m-auto">No past surgical procedures recorded.</h3>
        </div>
      </div>
    );
  }
  console.log("expanded", expanded);
  return (
    <div className="checkup-data-mh-container">
      <div className="pshx-container">
        <h2 className="pshx-title">Past Surgical History</h2>
        <div className="pshx-timeline">
          {surgicals.map((surgery, index) => {
            const { items = [] } = surgery;
            console.log("items", items);
            return (
              <div
                key={index}
                className={`pshx-item ${expanded === index ? "expanded" : ""}`}
                onClick={() => toggleExpand(index)}
              >
                <div className="pshx-dot" />
                <div className="pshx-content">
                  <div className="pshx-header">
                    <span className="pshx-procedure">
                      {capitalize(surgery.title)}
                    </span>
                    <button
                      size="sm"
                      style={{
                        marginRight: "-5px",
                      }}
                      // color="white"
                      className="search-add-btn ml-2 py-1 "
                    >
                      <MDBIcon icon="plus" size="sm" />
                    </button>
                  </div>
                  <div
                    className={`pshx-body ${
                      expanded === index ? "show" : "hide"
                    }`}
                  >
                    {items.map((item, i) => {
                      const {
                        physician = {},
                        hospital = "",
                        remarks = "",
                        diagnosis = "",
                      } = item;
                      return (
                        <div key={`${i}-${item._id}`} className="ml-3">
                          <p>
                            <strong>Hospital:</strong> {hospital}
                            <span className="pshx-date ml-2">
                              {dateFormat(surgery.createdAt)}
                            </span>
                          </p>
                          {physician?.name && (
                            <p>
                              <strong>
                                {physician?.specialization
                                  ? capitalize(physician.specialization)
                                  : "Surgeon"}
                                :
                              </strong>{" "}
                              {physician.name}
                            </p>
                          )}
                          {diagnosis && (
                            <p className="pshx-complication">
                              <strong>Diagnosis:</strong> {diagnosis}
                            </p>
                          )}
                          {remarks && (
                            <p>
                              <strong>Remarks:</strong> {remarks}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
