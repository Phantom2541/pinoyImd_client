import Tracker from "../../tracker";
import { MDBCol, MDBRow } from "mdbreact";
import { useState, useEffect } from "react";
import Header from "../../../../../../../components/printout/task/laboratory/header";
import { Banner, Cloudinary } from "../../../../../../../services/utilities";
import BodySwitcher from "../../../../../../../components/printout/task/laboratory/bodySwitcher";
import Signatories from "../../../../../../../components/printout/task/laboratory/signatories";
import "./printout.css";
import "./style.css";
import LabRadSkeleton from "../../skeleton/rablad";
import { useDispatch, useSelector } from "react-redux";
import {
  TRACKER,
  SetPatient,
} from "../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import ImgMagnifier from "../../../../../../../components/images/magnifier/imgMagnifier";

function chunkArray(array, size) {
  const result = [];
  const entries = Object.entries(array);
  for (let i = 0; i < entries.length; i += size) {
    result.push(Object.fromEntries(entries.slice(i, i + size)));
  }
  return result;
}

const Printout = ({ task, onloaded, setOnloaded }) => {
  const { branchId, remarks, signatories, packages } = task;
  const chunks = chunkArray(packages, 23); // adjust row count per page here
  return (
    <div className=" d-flex justify-content-center">
      <div
        className="laboratory-container"
        style={{ zoom: "80%", width: "95%" }}
      >
        {chunks.map((chunk, index) => (
          <div key={index} className="laboratory-page">
            <div className="laboratory-page-content">
              <Banner
                company={branchId.companyId?.name}
                branch={branchId.name}
                bid={branchId?.bid || ""}
                onloaded={onloaded}
                setOnloaded={setOnloaded}
                className="laboratory-banner"
              />
              <div className="laboratory-body">
                <Header task={task} />
                <BodySwitcher
                  task={{
                    ...task,
                    packages: chunk,
                    data: packages,
                  }}
                />
              </div>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Laboratory() {
  const { token } = useSelector(({ auth }) => auth),
    { patient: appointment } = useSelector(({ appointments }) => appointments),
    { isLoading } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();
  const [task, setTask] = useState({ _id: "" });
  const [onloaded, setOnloaded] = useState(false);
  const { patient } = appointment;
  // component
  useEffect(() => {
    const handler = () => {
      setTask(JSON.parse(localStorage.getItem("taskPrintout")));
    };

    window.addEventListener("taskPrintout-change", handler);
    return () => window.removeEventListener("taskPrintout-change", handler);
  }, []);

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

  if (isLoading) {
    return <LabRadSkeleton />;
  }

  const { activeDiag = {} } = appointment || {};
  const { isImg = false, section, imgId, date } = activeDiag;
  if (task?._id)
    return (
      <MDBRow className="h-100">
        <MDBCol md="10" className="p-1 h-100" style={{ overflow: "auto" }}>
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
        <MDBCol md="2" className="p-1">
          <Tracker />
        </MDBCol>
      </MDBRow>
    );

  return (
    <MDBRow className="h-100">
      <MDBCol md="10" className="p-1">
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
          Laboratory Results is Empty
        </div>
      </MDBCol>
      <MDBCol md="2" className="p-1">
        <Tracker />
      </MDBCol>
    </MDBRow>
  );
}
