// Consultations.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Body from "./body";
import Patient from "./patientInfo";
import Note from "./note";
import Certificate from "./note/certificate";
import Clearance from "./note/clearance";
import RequestForm from "./note/forms";
import Prescription from "./note/prescription";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import { GET_PATIENT } from "../../../../../services/redux/slices/diagnostics/consultations";

export default function Consultations() {
  const { token } = useSelector(({ auth }) => auth);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const ehrId = params.get("ehrId");

  const [activePanels, setActivePanels] = useState({
    request: false,
    prescription: false,
    medcert: false,
    clearance: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      GET_PATIENT({ token, key: { _id: ehrId || "636d37e0187c30ab0f611ce4" } })
    );
  }, [ehrId, token, dispatch]);

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

  return (
    <div className="checkup-data-container">
      <Body />
      <Patient activePanels={activePanels} />

      <Note
        togglePanel={togglePanel}
        buttonRefs={buttonRefs}
        activePanels={activePanels}
      />

      <div
        className={`checkup-data-note-mask ${
          Object.values(activePanels).some(Boolean) && "active"
        }`}
      />

      <Prescription
        active={activePanels.prescription}
        buttonRefs={buttonRefs}
      />
      <RequestForm active={activePanels.request} buttonRefs={buttonRefs} />
      <Certificate active={activePanels.medcert} buttonRefs={buttonRefs} />
      <Clearance active={activePanels.clearance} buttonRefs={buttonRefs} />
    </div>
  );
}
