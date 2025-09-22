import Tracker from "../../tracker";
import { MDBCol, MDBRow } from "mdbreact";
import { useState, useEffect } from "react";
import { Cloudinary } from "../../../../../../../services/utilities";
import "./printout.css";
import "./style.css";
import LabRadSkeleton from "../../skeleton/rablad";
import { useDispatch, useSelector } from "react-redux";
import {
  TRACKER,
  SetCOLLECTIONS as SetRESULTS,
  SetPatient,
} from "../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import ImgMagnifier from "../../../../../../../components/images/magnifier/imgMagnifier";
import Laboratory from "./laboratory";
import Radiology from "./radiology";
const resultMap = {
  Laboratory: Laboratory,
  Radiology: Radiology,
};

export default function Diagnostics({ task: department }) {
  const { token } = useSelector(({ auth }) => auth),
    { patient: appointment } = useSelector(({ appointments }) => appointments),
    { isLoading, collections } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();
  const [task, setTask] = useState({ _id: "" });
  const [onloaded, setOnloaded] = useState(false);
  const { patient } = appointment;
  // component
  useEffect(() => {
    let isMounted = true;
    const handler = () => {
      if (isMounted) {
        setTask(JSON.parse(localStorage.getItem("taskPrintout")));
      }
    };

    window.addEventListener("taskPrintout-change", handler);
    return () => {
      isMounted = false;
      window.removeEventListener("taskPrintout-change", handler);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const lsName = `consult-results-${department}-${patient._id}`;
    const ls = localStorage.getItem(lsName);
    if (ls) {
      dispatch(SetRESULTS(JSON.parse(ls)));
    } else {
      dispatch(
        TRACKER({
          token,
          key: {
            customerId: patient._id,
            department,
            isClinic: true,
          },
        })
      )
        .unwrap?.()
        .then((action) => {
          const { payload = [] } = action || {};
          localStorage.setItem(lsName, JSON.stringify(payload));
        })
        .catch((error) => {
          dispatch(SetRESULTS([]));
          console.log("error", error.message);
        });
    }

    // Dispatch SetPatient (synchronous, safe sa unmount)
    if (isMounted) {
      dispatch(SetPatient(patient));
    }

    return () => {
      isMounted = false; // mark as unmounted
    };
  }, [patient, token, dispatch, department]);
  if (isLoading) {
    return <LabRadSkeleton />;
  }

  const { activeDiag = {} } = appointment || {};
  const { isImg = false, section, imgId, date } = activeDiag;

  const Printout = resultMap[department];
  const haveRecords = collections.length > 0;
  if (task?._id || (isImg && section))
    return (
      <MDBRow className="h-100">
        <MDBCol
          md={!haveRecords ? "10" : "10"}
          className="p-1 h-100"
          style={{ overflow: "auto" }}
        >
          {isImg ? (
            <div
              className="d-flex justify-content-center"
              style={{ zoom: "70%" }}
            >
              <ImgMagnifier
                src={`${Cloudinary.getEndpoint()}/${imgId}/users/${
                  patient?.email
                }/EHR/${section}_${date}.jpg`}
              />
            </div>
          ) : (
            <Printout
              task={task}
              onloaded={onloaded}
              setOnloaded={setOnloaded}
            />
          )}
        </MDBCol>
        {haveRecords && (
          <MDBCol md="2" className="p-1">
            <Tracker />
          </MDBCol>
        )}
      </MDBRow>
    );

  if (collections.length === 0) {
    return (
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
        {department} Results is Empty
      </div>
    );
  }

  return (
    <MDBRow className="h-100">
      <MDBCol md="10" className="p-1">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
            fontSize: "2rem", // bahagyang mas maliit para readability
            fontWeight: "600", // medium-bold
            color: "#555", // subtle gray
            textAlign: "center",
            padding: "0 1rem", // padding para hindi ma-cut sa mobile
          }}
        >
          Please select a {department} result from the right panel first.
        </div>
      </MDBCol>
      <MDBCol md="2" className="p-1">
        <Tracker />
      </MDBCol>
    </MDBRow>
  );
}
