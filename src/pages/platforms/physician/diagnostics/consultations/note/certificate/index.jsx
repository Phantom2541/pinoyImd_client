import usePanelPosition from "../panelPosition";
import { MDBIcon } from "mdbreact";
import LOGO from "./../../../../../../../assets/aplhamed.png";
import CADUCEUS from "./../../../../../../../assets/caduceus.png";
import SIGNATURE from "./../../../../../../../assets/templateSampleSignature.png";

const certificateData = {
  patientName: "Jhon Kevin Magtalas",
  gender: "Male",
  age: 21,
  address: "Magsaysay Bayombong Nueva Vizcaya",
  diagnosis: "Pneumonia",
  startDate: "August 1, 2025",
  endDate: "August 21, 2025",
  doctorName: "Dr. Emily Clark",
};

export default function MedicalCertificate({
  active,
  buttonRefs,
  togglePanel,
}) {
  const style = usePanelPosition(active, buttonRefs.clearance, {
    width: 700,
    height: 600,
  });

  return (
    <div style={style} className="checkup-data-clearance">
      <MDBIcon
        icon="times"
        className="checkup-data-note-close"
        onClick={() => togglePanel("medcert")}
      />
      <div className="checkup-data-clearance-card">
        {/* Header */}
        <div className="checkup-data-clearance-card-header">
          <img src={LOGO} alt="" />
          <span>Medi Care</span>
          <span>123 Main St., Quezon City</span>
          <span>Contact: (02) 1234-5678</span>
        </div>

        {/* Title */}
        <h1 className="checkup-data-clearance-card-title">
          Medical Certificate
        </h1>

        {/* Body */}
        <div className="checkup-data-clearance-card-body">
          <div className="checkup-data-clearance-card-body-date">
            <span>Date:</span>
            <span>{certificateData.endDate}</span>
          </div>
          <img alt="caducues" src={CADUCEUS} />
          <label>TO WHOMSOEVER IT MAY CONCERN</label>

          <div className="checkup-data-clearance-card-body-text">
            <span>
              This is to certify that Mr/Mrs.&nbsp;
              <span className="checkup-data-clearance-card-body-data width-50">
                {certificateData.patientName}
              </span>
              &nbsp; Male/Female&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.gender}
              </span>
              &nbsp;Age&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.age}
              </span>
              &nbsp;years, residing at&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.address}
              </span>
              &nbsp;was under my treatment since&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.startDate}
              </span>
              &nbsp; Suffering from&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.diagnosis}
              </span>
              . He/She is/was advised treatment or rest for this period&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.endDate}
              </span>
              .
            </span>
          </div>

          {/* Doctor */}
          <div className="checkup-data-clearance-card-body-doctor">
            <span>{certificateData.doctorName}</span>
            <span>Physician/Examiner</span>
            <img alt="signature" src={SIGNATURE} />
          </div>
        </div>
      </div>
    </div>
  );
}
