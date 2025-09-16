import { useSelector } from "react-redux";
import {
  billingAddress,
  Cloudinary,
  fullName,
  properFullname,
} from "../../../../../../../services/utilities";

const Header = () => {
  const { activePlatform = {}, auth = {} } = useSelector(({ auth }) => auth);
  const { patient } = useSelector(({ consultations }) => consultations);
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
              style={{ fontSize: "1rem" }}
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
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Name: {fullName(name) || ""}
              </span>
            </td>
          </tr>

          <tr style={{ height: "30px" }}>
            <td style={cellStyle}>
              Date of Birth:{" "}
              {dob ? new Date(dob).toLocaleDateString("en-US") : ""}
            </td>

            <td style={cellStyle}>
              Sex: {isMale === true ? "Male" : isMale === false ? "Female" : ""}
            </td>

            <td style={cellStyle}>CP#: {mobile || ""}</td>
          </tr>

          <tr style={{ height: "20px" }}>
            <td colSpan={2} style={cellStyle}>
              Address: {address ? billingAddress(address) : ""}
            </td>
            <td style={cellStyle}>
              Physician: {auth?.fullName?.title || ""}
              {properFullname(auth?.fullName)}
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
  fontWeight: "bold",
};

export default Header;
