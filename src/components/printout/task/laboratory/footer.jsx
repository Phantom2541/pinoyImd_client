import { QRCodeCanvas } from "qrcode.react";
import pinoyImd from "../../../../assets/iMD.png";
import { ENDPOINT, mobile } from "../../../../services/utilities";
import { useSelector } from "react-redux";
const Footer = ({ dealId }) => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { branch = {} } = activePlatform || {},
    { companyId = {} } = branch || {};
  return (
    <div
      style={{
        borderTop: "2px dashed transparent",
        borderImage:
          "repeating-linear-gradient(to right, #888 0 10px, transparent 10px 20px)",
        borderImageSlice: 1,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "0.85rem",
        color: "#444",
      }}
    >
      <div
        className="d-flex px-2 align-items-center justify-content-between"
        style={{ gap: "1rem" }}
      >
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <img
              alt="QR Code"
              src={pinoyImd}
              style={{
                height: "5rem",
                width: "5rem",
                objectFit: "contain",
              }}
            />
            <div className="mt-1">
              <h5
                style={{
                  margin: 0,
                  fontWeight: "600",
                  fontSize: "1rem",
                  color: "#222",
                  lineHeight: 1.2,
                }}
              >
                PINOY-iMD
              </h5>
            </div>
          </div>
          <div className="mt-2">
            <h5 style={{ fontWeight: 500 }}>
              PINOY INTEGRATED MEDICAL DIAGNOSTICS
            </h5>
            <h6 style={{ marginTop: "-0.5rem" }}>
              <i>
                With Every Task, Test, and Touchpoint — We Stand Behind Filipino
                Healthcare Heroes.
              </i>
            </h6>
            <h6 style={{ marginTop: "-0.5rem" }}>
              Empowered By: <strong>Techonowiz Solution Provider</strong>
            </h6>
            <h6 style={{ marginTop: "-0.5rem" }}>
              Contact Number: <strong>{mobile("09350339777")}</strong>
            </h6>
            <h6 style={{ marginTop: "-0.5rem" }}>
              Address:{" "}
              <strong>
                Labanos Compound, Gulod Street, Brgy.San Pedro General Tino N.E
              </strong>
            </h6>
          </div>
        </div>
        <div>
          <div className="m-0 p-1 ml-4">
            <QRCodeCanvas
              value={`${ENDPOINT}/emr/portal/${companyId?._id}/${dealId}`}
              size={78}
            />
          </div>

          <div>
            <h5
              style={{
                margin: 0,
                fontWeight: "600",
                fontSize: "1rem",
                color: "#222",
                lineHeight: 1.2,
              }}
            >
              Scan to view e-Copy
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
