import { QRCodeCanvas } from "qrcode.react";
import { ENDPOINT, mobile } from "../../../../services/utilities";
import pinoyImd from "../../../../assets/iMD.png";
const Footer = ({ dealId }) => {
  return (
    <div
      style={{
        borderTop: "1px dashed #888",
        paddingTop: "1rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "0.85rem",
        color: "#444",
      }}
    >
      <div
        className="d-flex px-4 align-items-center justify-content-between"
        style={{ gap: "1rem" }}
      >
        <div>
          <img
            alt="QR Code"
            src={pinoyImd}
            style={{
              height: "5rem",
              width: "5rem",
              objectFit: "contain",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            }}
          />
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
              PINOY-IMD
            </h5>
          </div>
        </div>
        <div className="mt-2">
          <h5 style={{ fontWeight: 500 }}>
            PINOY INTEGRATED MEDICAL DIAGNOSTICS
          </h5>
          <h5
            className="grey-text text-center"
            style={{
              marginTop: "-0.5rem",
              fontSize: "1.5rem",
              fontWeight: 400,
            }}
          >
            <i> {mobile("09814563813")}</i>
          </h5>
        </div>
        <div>
          <div className="m-0 p-1 ml-4">
            <QRCodeCanvas
              value={`${ENDPOINT}/emr/portal/${dealId}`}
              size={75}
            />
          </div>

          <div className="mt-n2">
            <h5
              style={{
                margin: 0,
                fontWeight: "600",
                fontSize: "1rem",
                color: "#222",
                lineHeight: 1.2,
              }}
            >
              Scan this QR code
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
