import React, { useEffect } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  TRACKER,
  SetPatient,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import Body from "./body";
export default function Tracker({ setActiveTracker, activeTracker }) {
  const { patient } = useSelector(({ consultations }) => consultations);
  const { token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      TRACKER({
        token,
        key: {
          customerId: patient._id,
        },
      })
    );
    dispatch(SetPatient(patient));
  }, [patient, token, dispatch]);

  return (
    <div className="checkup-data-tracker">
      <Body />
    </div>
  );
}
