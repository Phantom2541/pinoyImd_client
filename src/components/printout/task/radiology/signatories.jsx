import { Cloudinary, signatoryName } from "../../../../services/utilities";

const Signature = ({ person, label, style = {}, withSignature }) => {
  return (
    <div style={{ ...style }} className="text-center position-relative">
      {withSignature && (
        <img
          style={{
            position: "absolute",
            height: 100,
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          src={`${Cloudinary.getEndpoint()}/users/${
            person?.email
          }/signature.png?v=${Date.now()}`}
          alt={person?.email || "signature"}
        />
      )}

      <h5 className="fw-bold mb-0 text-uppercase">
        <u>{signatoryName(person?.fullName)} </u>
      </h5>
      {label}
      <h6>
        {label !== "Encoder" &&
          person?.prc &&
          ` PRC License #: ${person?.prc.id}`}
      </h6>
    </div>
  );
};

export default function Signatories({ signatories, form }) {
  const head = signatories[0],
    dr = signatories[1],
    frontdesk = signatories[2];
  const title =
    signatories[0]?.title === "RXT"
      ? "X-RAY TECHNOLOGIST"
      : "RADIOLOGIC TECHNOLOGIST";

  return (
    <div className="px-3 radiology-signatories ">
      <div className="mt-3">
        <div className="d-flex justify-content-between ">
          <Signature person={head} label={title} isHalf />
          <Signature person={frontdesk} label="Encoder" isHalf />
        </div>
        {form !== "ecg" && (
          <Signature
            person={dr}
            label="Radiologist"
            style={{ marginTop: "20px" }}
            withSignature
          />
        )}
      </div>
    </div>
  );
}
