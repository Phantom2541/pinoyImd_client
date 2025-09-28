import { useEffect, useState } from "react";
import "./style.css";
import Case from "../case";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import utils from "./utils";
import {
  DONE,
  SetPATIENT,
} from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Swal from "sweetalert2";
import { fullName } from "../../../../../../services/utilities";
import formattedQn from "../../../../../../services/utilities/formattedQn";
export default function Toolkit({ activePanels }) {
  const { token } = useSelector(({ auth }) => auth);
  const {
    cluster = [],
    patient: appointment,
    isUpdateDone,
  } = useSelector(({ appointments }) => appointments);
  const [activePage, setActivePage] = useState(1);
  const [activeQn, setActiveQn] = useState(-1);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const maxPage = 5;

  useEffect(() => {
    if (appointment?._id) {
      setActiveQn(appointment?.qn);
    }
  }, [appointment]);

  useEffect(() => {
    if (activeQn !== -1) {
      const idx = cluster.findIndex((p) => p.qn === activeQn);
      if (idx !== -1) {
        const page = Math.floor(idx / maxPage) + 1;
        setActivePage(page);
      }
    }
  }, [activeQn, cluster, maxPage]);

  const totalPages = Math.ceil(cluster.length / maxPage);
  const visible = cluster.slice(
    (activePage - 1) * maxPage,
    activePage * maxPage
  );

  const handleSetQN = (_appointment) => {
    const { qn, _id } = _appointment;

    setActiveQn(qn);
    const newParams = new URLSearchParams(location.search);
    newParams.set("ehrId", _id); // add if missing, replace if exists
    history.replace(`${location.pathname}?${newParams.toString()}`);

    dispatch(SetPATIENT(_appointment));
  };

  const resetResultForm = () => {
    localStorage.removeItem("taskPrintout");
    window.dispatchEvent(new Event("taskPrintout-change"));
  };

  const handlePrev = () => {
    if (activeQn === -1) return;
    const qn = utils.findNextQn(activeQn, -1, cluster);
    if (qn !== null) handleSetQN(qn);
    resetResultForm();
  };

  const handleNext = () => {
    if (activeQn === -1) return;
    const qn = utils.findNextQn(activeQn, +1, cluster);

    if (qn !== null) handleSetQN(qn);
    resetResultForm();
  };

  const handleDone = () => {
    const { consultation } = appointment;
    const { cases = [] } = consultation || {};
    const casesIds = cases.map((item) => item._id) || [];

    if (casesIds.length === 0) {
      return Swal.fire({
        title: "⚠️ Action Required",
        html: `
      <div style="font-size: 1.1rem; line-height: 1.5; text-align: left;">
        <p>
          Before completing this check-up, you need to <b>create or select at least one case</b> for the patient.
        </p>
        <p style="margin-top: 0.5rem; color: #555;">
          A case record is required so the doctor can properly document the consultation details.
        </p>
      </div>
    `,
        icon: "warning",
        confirmButtonText: "Got it",
        confirmButtonColor: "#f59e0b", // amber color
        allowOutsideClick: false,
      });
    }
    Swal.fire({
      title: `Are you sure?`,
      html: `
      <div style="font-size: 1.1rem; line-height: 1.5; text-align: center;">
        You are about to mark <b>${
          fullName(appointment?.patient?.fullName) || "this patient"
        }</b> as <b>done</b>.
        <br/>
        This action cannot be undone.
      </div>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark as done",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981", // green
      cancelButtonColor: "#ef4444", // red
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          DONE({
            token,
            data: {
              ...appointment,
              consultation: { ...consultation, cases: casesIds },
            },
          })
        );
      }
    });
  };

  const handleHalt = () => {
    const { consultation } = appointment;
    const { cases = [] } = consultation || {};
    const casesIds = cases.map((item) => item._id) || [];
    Swal.fire({
      title: `Are you sure?`,
      html: `
      <div style="font-size: 1.1rem; line-height: 1.5; text-align: center;">
        You are about to <b>halt</b> the consultation for 
        <b>${fullName(appointment?.patient?.fullName) || "this patient"}</b>.
        <br/><br/>
        You can return to this patient later at any time.
        <br/>
        Once halted, the system will automatically move on to the next patient.
      </div>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, halt this patient",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f59e0b", // amber / warning
      cancelButtonColor: "#ef4444", // red
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          DONE({
            token,
            data: {
              isDone: false,
              ...appointment,
              consultation: { ...consultation, cases: casesIds },
            },
          })
        );
      }
    });
  };

  const disabledPrev = cluster[0]?.qn === activeQn;
  const disabledNext = cluster[cluster.length - 1]?.qn === activeQn;

  return (
    <div
      className={`checkup-data-toolkit ${
        Object.values(activePanels).some(Boolean) && "active"
      }`}
    >
      <Case />

      <div className="checkup-data-toolkit-buttons">
        <button
          disabled={disabledPrev || isUpdateDone}
          className="checkup-data-toolkit-button prev mr-1"
          style={{ opacity: disabledPrev || isUpdateDone ? 0.5 : 1 }}
          onClick={handlePrev}
        >
          <span data-hover="«">Prev</span>
        </button>
        <div
          style={{ width: "17rem" }}
          className="d-flex justify-content-center align-items-end"
        >
          {activePage > 1 && (
            <span style={{ fontWeight: 500 }} className="mx-1">
              ...
            </span>
          )}
          {visible.map((patient, index) => {
            const { qn, status = "" } = patient;
            const disabled = !["confirmed", "done", "halt"].includes(status);

            return (
              <button
                className={`checkup-data-toolkit-pagination-item mx-1 d-flex justify-content-center ${
                  disabled && "disabled"
                } ${qn === activeQn && "active"} ${status}`}
                onClick={() => handleSetQN(patient)}
                key={index}
                title={status}
              >
                <span>{formattedQn(qn, cluster)}</span>
              </button>
            );
          })}
          {activePage < totalPages && (
            <span style={{ fontWeight: 500 }} className="mx-1">
              ...
            </span>
          )}
        </div>
        <button
          className="checkup-data-toolkit-button next ml-1"
          onClick={() => handleNext()}
          disabled={disabledNext || isUpdateDone}
          style={{ opacity: disabledNext || isUpdateDone ? 0.5 : 1 }}
        >
          <span data-hover="»">Next</span>
        </button>
        <button
          className="checkup-data-toolkit-button done ml-5"
          disabled={isUpdateDone}
          style={{ opacity: isUpdateDone ? 0.5 : 1 }}
          onClick={handleDone}
        >
          <span data-hover={"✓"}>
            {appointment.status === "done" ? "Update" : "Done"}
          </span>
        </button>
        {appointment.status === "confirmed" && (
          <button
            className="checkup-data-toolkit-button halt"
            disabled={isUpdateDone}
            style={{ opacity: isUpdateDone ? 0.5 : 1 }}
            onClick={handleHalt}
          >
            <span data-hover={"⏸"}>Halt</span>
          </button>
        )}
      </div>
    </div>
  );
}
