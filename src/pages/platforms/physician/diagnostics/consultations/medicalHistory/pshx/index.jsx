import React, { useState, useEffect } from "react";
import "../style.css";
import DraggableList, { useDragAndDrop } from "../dragAndDrop";
import { useDispatch, useSelector } from "react-redux";
import {
  PSH,
  SetITEM,
} from "../../../../../../../services/redux/slices/diagnostics/cases";
import {
  capitalize,
  dateFormat,
} from "../../../../../../../services/utilities";
import { MDBIcon } from "mdbreact";
import CaseModal from "./modal";

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
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(SetITEM(surgery));
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
                        ap = [],
                        date = { start: "", end: "" },
                        hospital = "",
                        remarks = "",
                        diagnosis = "",
                        status = "",
                      } = item || {};
                      const { start = "", end = "" } = date;
                      return (
                        <div
                          key={`${i}-${item._id}`}
                          className="ml-3 pshx-item-body"
                        >
                          {i !== 0 && (
                            <div
                              className="mb-3"
                              style={{
                                border: "1px  solid #9f9c9cff",
                              }}
                            ></div>
                          )}
                          <p>
                            <strong>Hospital:</strong> {hospital}
                            {start && (
                              <span
                                className="pshx-date ml-2"
                                title={`${dateFormat(start)} ${
                                  end ? ` - ${dateFormat(end)}` : ""
                                }`}
                              >
                                {new Date(start).toLocaleString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                })}
                              </span>
                            )}
                          </p>
                          {diagnosis && (
                            <p className="pshx-complication">
                              <strong>Diagnosis:</strong> {diagnosis}
                            </p>
                          )}
                          <p className="pshx-complication">
                            <strong>Status:</strong> {capitalize(status)}
                          </p>
                          {ap.length > 0 && (
                            <p>
                              <strong>Attending Physician:</strong>{" "}
                              {ap.map((a, index) => {
                                const {
                                  name = "",
                                  specialization = "",
                                  assignedDate = "",
                                } = a || {};
                                return (
                                  <div key={a?._id} className="ml-3">
                                    <span style={{ fontWeight: 500 }}>
                                      {index + 1}.
                                    </span>{" "}
                                    {specialization && `${specialization}: `}
                                    {name}
                                    {assignedDate &&
                                      `, ${dateFormat(assignedDate)}`}
                                  </div>
                                );
                              })}
                            </p>
                          )}
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
