import { useSelector } from "react-redux";
import {
  billingAddress,
  Cloudinary,
  fullName,
} from "../../../../../../../services/utilities";

const Header = () => {
  const { activePlatform = {}, auth = {} } = useSelector(({ auth }) => auth);
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const { patient } = appointment;
  const { fullName: name, dob, isMale, mobile, address } = patient || {};

  const companyName = activePlatform?.branch?.companyId?.name || "";
  const branchName = activePlatform?.branch?.name || "";
  const BannerURL = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    companyName
  )}//${encodeURIComponent(branchName)}/banner`;

  return (
    <div className="d-flex justify-content-center">
      <table className="laboratoryRequestForm-printout-table">
        <thead>
          <tr>
            <th colSpan={3}>
              <img
                src={BannerURL}
                alt="Banner"
                className="laboratoryRequestForm-banner"
              />
            </th>
          </tr>
          <tr>
            <th
              colSpan={3}
              style={{ fontSize: "1.2rem", fontWeight: "bold" }}
              className="laboratoryRequestForm-font text-center"
            >
              PATIENT REQUEST FORM
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Patient Info */}

          <tr>
            <td colSpan={3} style={cellStyle}>
              <span style={{ fontSize: ".8rem" }}>Name:&nbsp;</span>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: ".8rem",
                  textTransform: "capitalize",
                }}
              >
                {fullName(name).toLowerCase() || ""}
              </span>
            </td>
          </tr>

          <tr style={{ height: "30px" }}>
            <td style={cellStyle}>
              <span style={{ fontSize: ".8rem" }}>Date of Birth:&nbsp;</span>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: ".8rem",
                  textTransform: "capitalize",
                }}
              >
                {dob ? new Date(dob).toLocaleDateString("en-US") : ""}
              </span>
            </td>

            <td style={cellStyle}>
              <span style={{ fontSize: ".8rem" }}>Sex:&nbsp;</span>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: ".8rem",
                  textTransform: "capitalize",
                }}
              >
                {isMale === true ? "Male" : isMale === false ? "Female" : ""}
              </span>
            </td>

            <td style={cellStyle}>
              <span style={{ fontSize: ".8rem" }}>CP#:&nbsp;</span>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: ".8rem",
                  textTransform: "capitalize",
                }}
              >
                {mobile || ""}
              </span>
            </td>
          </tr>

          <tr style={{ height: "20px" }}>
            <td colSpan={2} style={cellStyle}>
              <span style={{ fontSize: ".8rem" }}> Address:&nbsp;</span>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: ".7rem",
                  textTransform: "capitalize",
                }}
              >
                {address ? billingAddress(address) : ""}
              </span>
            </td>
            <td style={cellStyle}>
              <span style={{ fontSize: ".8rem" }}>Physician:&nbsp;</span>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: ".8rem",
                  textTransform: "capitalize",
                }}
              >
                {auth?.fullName?.title || ""} {auth?.fullName?.lname}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const cellStyle = {
  border: "1px solid #000",
  padding: "6px",
  fontSize: "1rem",
};

export default Header;
