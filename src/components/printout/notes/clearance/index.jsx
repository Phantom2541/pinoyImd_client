import CADUCEUS from "../../../../assets/caduceus.png";
import {
  billingAddress,
  Cloudinary,
  contacts,
  fullName,
  getAge,
  properFullname,
} from "../../../../services/utilities";

export default function Clearance({ note }) {
  const { branch, physician } = note,
    { fullName: name, isMale, dob, address } = note?.patient || {};
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
        <h1 className="checkup-data-clearance-card-title">Medical Clearance</h1>

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
              , was examined at this clinic and is found to be
              <span className="checkup-data-clearance-card-body-data">
                medically fit
              </span>{" "}
              to engage in
              <span className="checkup-data-clearance-card-body-data">
                work/school/sports/travel
              </span>
              .
            </span>
          </div>

          {/* Doctor */}
          <div className="checkup-data-clearance-card-body-doctor">
            <span>{properFullname(physician.fullName)}</span>
            <span>Physician/Examiner</span>
            <img alt="signature" src={signUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
