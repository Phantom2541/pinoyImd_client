import usePanelPosition from "../panelPosition";
import { MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";
import "./../style.css";
import CADUCEUS from "./../../../../../../../assets/caduceus.png";
import {
  Banner,
  billingAddress,
  Cloudinary,
  contacts,
  fullName,
  getAge,
  properFullname,
} from "../../../../../../../services/utilities";
import QrCodeGenerator from "../../../../../../../components/qrCode";

export default function Clearance({ active, buttonRefs, togglePanel }) {
  const style = usePanelPosition(active, buttonRefs.clearance, {
    width: 700,
    height: 530,
  });
  const { patient: appointment } = useSelector(
      ({ appointments }) => appointments
    ),
    { auth, activePlatform } = useSelector(({ auth }) => auth),
    { fullName: name, isMale, dob, address } = appointment?.patient || {};
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
    <div
      style={{
        ...style,
      }}
      className="checkup-data-clearance"
    >
      <MDBIcon
        icon="times"
        className="checkup-data-note-close"
        onClick={() => togglePanel("clearance")}
      />
      <div className="checkup-data-clearance-card">
        {/* Header */}
        <Banner
          company={activePlatform.branch.companyId.name}
          branch={activePlatform.branch.name}
        />
        {/* <div className="checkup-data-clearance-card-header">
          <img src={logoURL} alt="" />
          <span>{companyname}</span>
          <span>{billingAddress(branchaddress)}</span>
          <span>Contact: {contacts(branchcontact)}</span>
        </div> */}
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
          <div className="d-flex justify-content-between align-items-end w-full  mt-3  w-100">
            <div className="checkup-data-clearance-card-body-doctor">
              <span>{properFullname(auth.fullName)}</span>
              <span>Physician/Examiner</span>
            </div>
            <div style={{ marginBottom: "-5px" }}>
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
