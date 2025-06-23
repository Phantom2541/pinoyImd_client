import React from "react";
import { ENDPOINT, properFullname } from "../../../../services/utilities";

const Signature = ({ person, label, isHalf, style = {}, withSignature }) => {
  return (
    <div style={style} className="text-center position-relative">
      {withSignature && (
        <img
          style={{
            position: "absolute",
            height: 100,
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          src={`${ENDPOINT}/public/users/${person?.email}/signature.png`}
          alt={person?.email || "signature"}
        />
      )}

      <h5
        className="fw-bold mb-0 text-uppercase"
        style={{ fontSize: "1.1rem" }}
      >
        <u>{properFullname(person?.fullName)}</u>
      </h5>
      {label}
      <h6 style={{ fontSize: "0.8rem" }}>
        {label !== "Receptionist" && person?.prc && ` PRC#: ${person?.prc.id}`}
      </h6>
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
          style={{ marginTop: "-0.5rem" }}
          withSignature={head?.withSignature}
        />
        <Signature person={frontdesk} label="Receptionist" isHalf />
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
