import CADUCEUS from "../../../../assets/caduceus.png";
import {
  billingAddress,
  contacts,
  properFullname,
  Cloudinary,
  getAge,
  fullName,
} from "../../../../services/utilities";
import QrCodeGenerator from "../../../qrCode";
const certificateData = {
  diagnosis: "Pneumonia",
  startDate: "August 1, 2025",
  endDate: "August 21, 2025",
};

export default function Certificate({ note }) {
  const { branch, physician } = note,
    { fullName: name, isMale, dob, address } = note?.patient || {};
  const { consultation = {} } = note;
  const { diagnosis = "" } = consultation || {};
  const logoURL =
    `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
      branch.companyId.name
    )}/logo` || "";
  const signUrl =
    `${Cloudinary.getEndpoint()}/users/${physician.email}/signature` || "";

  const companyname = branch.companyId.name || "";
  const branchaddress = branch.address || "";
  const branchcontact = branch.contacts.mobile || "";

  return (
    <div style={{ width: 700, height: 530 }} className="bg-white">
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
          <img alt="caducues" src={CADUCEUS} style={{ zIndex: 2 }} />
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
                {diagnosis || ""}
              </span>
              . He/She is/was advised treatment or rest for this period&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.endDate}
              </span>
              .
            </span>
          </div>

          {/* Doctor */}
          <div className="d-flex align-items-end justify-content-between  w-100">
            <div className="checkup-data-clearance-card-body-doctor">
              <span>{properFullname(physician.fullName)}</span>
              <span>Physician/Examiner</span>
              <img alt="signature" src={signUrl || ""} />
            </div>
            <div>
              <QrCodeGenerator
                value="portal/clinic/68d8ba68b5d22e3b77e0f83d/68d8ba68b5d22e3b77e0f83d"
                size={80}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
