import usePanelPosition from "../panelPosition";
import { MDBIcon } from "mdbreact";
import CADUCEUS from "./../../../../../../../assets/caduceus.png";
import { useSelector } from "react-redux";
import {
  billingAddress,
  contacts,
  properFullname,
  Cloudinary,
  getAge,
  fullName,
} from "../../../../../../../services/utilities";

const certificateData = {
  diagnosis: "Pneumonia",
  startDate: "August 1, 2025",
  endDate: "August 21, 2025",
};

export default function MedicalCertificate({
  active,
  buttonRefs,
  togglePanel,
}) {
  const style = usePanelPosition(active, buttonRefs.medcert, {
    width: 700,
    height: 530,
  });
  const { patient: appointment } = useSelector(
      ({ appointments }) => appointments
    ),
    { auth, activePlatform } = useSelector(({ auth }) => auth),
    { fullName: name, isMale, dob, address } = appointment?.patient || {};
  const { consultation = {} } = appointment;
  const { prescription } = consultation || {};
  const logoURL =
    `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
      activePlatform.branch.companyId.name
    )}/logo` || "";
  const signUrl =
    `${Cloudinary.getEndpoint()}/users/${auth.email}/signature` || "";

  const companyname = activePlatform.branch.companyId.name || "";
  const branchaddress = activePlatform.branch.address || "";
  const branchcontact = activePlatform.branch.contacts.mobile || "";

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
          <img src={logoURL} alt="" />
          <span>{companyname}</span>
          <span>{billingAddress(branchaddress)}</span>
          <span>Contact: {contacts(branchcontact)}</span>
        </div>

        {/* Title */}
        <h1 className="checkup-data-clearance-card-title">
          Medical Certificate
        </h1>

        {/* Body */}
        <div className="checkup-data-clearance-card-body">
          <div className="checkup-data-clearance-card-body-date">
            <span>Date:</span>
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "short", // o 'long' kung gusto full month name
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <img alt="caducues" src={CADUCEUS} />
          <label>TO WHOMSOEVER IT MAY CONCERN</label>

          <div className="checkup-data-clearance-card-body-text">
            <span>
              This is to certify that Mr/Mrs.&nbsp;
              <span className="checkup-data-clearance-card-body-data width-50">
                {fullName(name)}
              </span>
              &nbsp; Male/Female&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {isMale ? "Male" : "Female"}
              </span>
              &nbsp;Age&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {getAge(dob)}
              </span>
              &nbsp;years, residing at&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {billingAddress(address)}
              </span>
              &nbsp;was under my treatment since&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.startDate}
              </span>
              &nbsp; Suffering from&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {prescription?.diagnosis || ""}
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
            <span>{properFullname(auth.fullName)}</span>
            <span>Physician/Examiner</span>
            <img alt="signature" src={signUrl || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
