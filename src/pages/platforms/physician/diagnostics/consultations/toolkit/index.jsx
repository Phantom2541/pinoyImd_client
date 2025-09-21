import React, { useEffect, useState } from "react";
import "./style.css";
import Case from "../case";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import utils from "./utils";
import {
  SetPATIENT,
  UPDATE,
} from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { socket } from "../../../../../../services/utilities";
import Spinner from "../../../../../../components/spinner";
export default function Toolkit({ activePanels }) {
  const { token } = useSelector(({ auth }) => auth);
  const {
    cluster = [],
    patient: appointment,
    formSubmitted,
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

  const handlePrev = () => {
    if (activeQn === -1) return;
    const qn = utils.findNextQn(activeQn, -1, cluster);
    if (qn !== null) handleSetQN(qn);
  };

  const handleNext = () => {
    if (activeQn === -1) return;
    const qn = utils.findNextQn(activeQn, +1, cluster);

    if (qn !== null) handleSetQN(qn);
  };

  const handleDone = () => {
    dispatch(
      UPDATE({
        token,
        data: { _id: appointment._id, status: "done" },
      })
    ).then((action) => {
      const { payload } = action;
      socket.emit("send_checkup_done", {
        data: payload,
        roomID: payload?.userId,
      });
    });
  };

  const disabledPrev = cluster[0]?.qn === activeQn;
  const disabledNext = cluster[cluster.length - 1]?.qn === activeQn;

  const formattedQn = (qn) => {
    const qnStr = String(qn);
    const main = qnStr.split(".")[0];

    const related = cluster
      .map((item) => String(item.qn))
      .filter((q) => q === main || q.startsWith(main + "."))
      .sort((a, b) => {
        if (a === main) return -1;
        if (b === main) return 1;
        const aSuffix = a.slice(main.length + 1);
        const bSuffix = b.slice(main.length + 1);
        const aNum = Number(aSuffix);
        const bNum = Number(bSuffix);
        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
        return aSuffix.localeCompare(bSuffix);
      });

    // only main and no subs -> keep as-is
    if (related.length === 1 && qnStr === main) return main;
    // main present -> main becomes A
    if (qnStr === main) return `${main}A`;

    const idx = related.indexOf(qnStr);
    if (idx === -1) return qnStr; // fallback

    // idx 0 = main -> A, idx 1 = first sub -> B, ...
    return `${main}${String.fromCharCode(65 + idx)}`;
  };

  return (
    <div
      className={`checkup-data-toolkit ${
        Object.values(activePanels).some(Boolean) && "active"
      }`}
    >
      <Case />

      <div className="checkup-data-toolkit-buttons">
        <button
          disabled={disabledPrev}
          className="checkup-data-toolkit-button prev mr-1"
          style={{ opacity: disabledPrev ? 0.5 : 1 }}
          onClick={handlePrev}
        >
          <span data-hover="«">Prev</span>
        </button>
        <div
          style={{ width: "17rem" }}
          className="d-flex justify-content-center"
        >
          {activePage > 1 && <span style={{ fontWeight: 500 }}>...</span>}
          {visible.map((patient, index) => {
            const { qn, status = "" } = patient;
            const disabled = status !== "confirmed";

            return (
              <button
                className={`checkup-data-toolkit-pagination-item mx-1 d-flex justify-content-center ${
                  disabled && "disabled "
                } ${qn === activeQn && "active"}`}
                onClick={() => handleSetQN(patient)}
                key={index}
              >
                <span>{formattedQn(qn)}</span>
              </button>
            );
          })}
          {activePage < totalPages && (
            <span style={{ fontWeight: 500 }}>...</span>
          )}
        </div>
        <button
          className="checkup-data-toolkit-button next ml-1"
          onClick={() => handleNext()}
          disabled={disabledNext}
          style={{ opacity: disabledNext ? 0.5 : 1 }}
        >
          <span data-hover="»">Next</span>
        </button>
        <button
          className="checkup-data-toolkit-button done"
          disabled={formSubmitted}
        >
          <span data-hover="✓" onClick={handleDone}>
            Done <Spinner formSubmitted={formSubmitted} />
          </span>
        </button>
      </div>
    </div>
  );
}
