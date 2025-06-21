import qr from "../../../../assets/qr.png";
import pinoyImd from "../../../../assets/iMD.png";
import { mobile } from "../../../../services/utilities";
const Footer = () => {
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
            {/* <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              PINOY INTEGRATED MEDICAL DIAGNOSTICS
            </p> */}
          </div>
        </div>
        <div className="mt-2">
          {/* <h5
            className="font-weight-bold text-center"
            style={{ fontSize: "1.5rem", fontWeight: 600 }}
          >
            PINOY-IMD
          </h5> */}
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
          <img
            alt="QR Code"
            className="p-1 ml-4"
            src={qr}
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
              Scan this QR code
            </h5>
            {/* <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              to view this result online
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
