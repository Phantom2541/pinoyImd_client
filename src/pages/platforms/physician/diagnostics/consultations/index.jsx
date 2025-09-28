// Consultations.jsx
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Body from "./bodyPanel/body";
import Patient from "./patientInfo";
import Note from "./note";
import Certificate from "./note/certificate";
import Clearance from "./note/clearance";
import RequestForm from "./note/forms";
import Prescription from "./note/prescription";
import Toolkit from "./toolkit";
import Skeleton from "./skeleton/main";
import Modal from "./medicalHistory/modal";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import {
  FIND as GET_APPOINTMENT,
  GET_BY_SCHED,
  SetCLUSTER,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import CaseModal from "./medicalHistory/pshx/modal";

export default function Consultations() {
  const { token } = useSelector(({ auth }) => auth);
  const { isLoading, cluster, isUpdateDone } = useSelector(
    ({ appointments }) => appointments
  );
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const ehrId = params.get("ehrId");
  const schedule = params.get("sched");

  const [activePanels, setActivePanels] = useState({
    request: false,
    prescription: false,
    medcert: false,
    clearance: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      GET_APPOINTMENT({
        token,
        key: { _id: ehrId || "636d37e0187c30ab0f611ce4" },
      })
    )
      .then((action) => {
        const { payload } = action.payload;
        const { clinic, sched } = payload;
        dispatch(
          GET_BY_SCHED({
            token,
            key: { clinic, sched },
          })
        ).then((action) => {
          const { payload } = action?.payload;

          dispatch(SetCLUSTER(payload));
        });
      })
      .catch((error) => {
        console.log("error", error.message);
      });
    // eslint-disable-next-line
  }, [token, dispatch]);

  const buttonRefs = {
    request: useRef(),
    prescription: useRef(),
    medcert: useRef(),
    clearance: useRef(),
  };

  // Toggle panel: only one can be open at a time
  const togglePanel = (type) => {
    setActivePanels((prev) => {
      const isOpening = !prev[type];
      return {
        request: false,
        prescription: false,
        medcert: false,
        clearance: false,
        ...(isOpening && { [type]: true }),
      };
    });
  };

  if (isLoading || !ehrId) return <Skeleton ehrId={ehrId} />;

  if (!isUpdateDone && ehrId && !cluster.length)
    return <Skeleton isDone={true} schedule={schedule} />;

  return (
    <>
      <div className="checkup-data-container">
        <Body />
        <Modal />
        <Patient activePanels={activePanels} />
        <Note
          togglePanel={togglePanel}
          buttonRefs={buttonRefs}
          activePanels={activePanels}
        />
        <Toolkit activePanels={activePanels} />

        <div
          className={`checkup-data-note-mask ${
            Object.values(activePanels).some(Boolean) && "active"
          }`}
        />

        <Prescription
          togglePanel={togglePanel}
          active={activePanels.prescription}
          buttonRefs={buttonRefs}
        />
        <RequestForm
          active={activePanels.request}
          buttonRefs={buttonRefs}
          togglePanel={togglePanel}
        />
        <Certificate
          active={activePanels.medcert}
          buttonRefs={buttonRefs}
          togglePanel={togglePanel}
        />
        <Clearance
          active={activePanels.clearance}
          buttonRefs={buttonRefs}
          togglePanel={togglePanel}
        />
      </div>

      <CaseModal />
    </>
  );
}
