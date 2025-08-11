import { Cloudinary, properFullname } from "../../../../services/utilities";
import "./style.css";

const Signature = ({ person, label, style = {}, withSignature }) => {
  return (
    <div style={style} className="text-center position-relative">
      {/* Signature behind the name */}
      {withSignature && (
        <img
          style={{
            height: 80,
            opacity: 0.6,
            marginBottom: "-1.5rem",
            zIndex: 0,
            position: "relative",
          }}
          src={`${Cloudinary.getEndpoint()}/users/${
            person?.email
          }/signature.png?v=${Date.now()}`}
          onError={(e) => (e.target.style.display = "none")} // hide if not found
          alt={person?.email || "signature"}
        />
      )}

      <h5
        className="fw-bold mb-0 text-uppercase"
        style={{
          fontSize: "1.1rem",
          position: "relative",
          zIndex: 1, // Bring text in front
        }}
      >
        <u>{properFullname(person?.fullName)}</u>
      </h5>

      <div style={{ position: "relative", zIndex: 1 }}>
        {label}
        <h6 style={{ fontSize: "0.8rem" }}>
          {label !== "Receptionist" &&
            person?.prc &&
            ` PRC#: ${person?.prc.id}`}
        </h6>
      </div>
    </div>
  );
};

export default function Signatories({ signatories = [] }) {
  const head = signatories[0],
    dr = signatories[1],
    frontdesk = signatories[2];

  return (
    <div className="pt-4 px-3 laboratory-signatories">
      <div className="d-flex justify-content-between">
        <Signature
          person={head}
          label="Medical Laboratory Scientist"
          // style={{ marginTop: "-0.5rem" }}
          withSignature={head?.withSignature}
        />
        <Signature person={frontdesk} label="Encoder" isHalf />
      </div>
      <Signature
        person={dr}
        label="Pathologist"
        style={{ marginTop: "-0.5rem" }}
        withSignature
      />
    </div>
  );
}
