import React from "react";
import { ENDPOINT, properFullname } from "../../services/utilities";

const Signature = ({ person, label, isHalf, style = {}, withSignature }) => {
  return (
    <div
      style={{ width: isHalf ? "50%" : "100%", ...style }}
      className="text-center position-relative"
    >
      {withSignature && (
        <img
          style={{
            position: "absolute",
            height: 100,
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          src={`${ENDPOINT}/public/patron/${person?.email}/signature.png`}
          alt={person?.email || "signature"}
        />
      )}

      <h5 className="fw-bold mb-0 text-uppercase">
        <u>{properFullname(person?.fullName)}</u>
      </h5>
      {label}
      {label !== "Receptionist" && person?.prc && ` PRC#: ${person?.prc.id}`}
    </div>
  );
};

export default function Signatories({ signatories }) {
  const head = signatories[0],
    sub = signatories[1],
    frontdesk = signatories[2];
  return (
    <div className="pt-4">
      <div className="d-flex">
        <Signature person={head} label="Medical Laboratory Scientist" isHalf />
        <Signature person={frontdesk} label="Receptionist" isHalf />
      </div>
      <Signature
        person={sub}
        label="Pathologist"
        style={{ marginTop: "20px" }}
        withSignature
      />
    </div>
  );
}
