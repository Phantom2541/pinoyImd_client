import { useState } from "react";
import {
  Cloudinary,
  dateFormat,
} from "../../../../../../../../../services/utilities";
import Options from "./options";
import Badge from "./badge";
import { MDBBtn, MDBIcon } from "mdbreact";
import { HMO } from "../../../../../../../../../services/fakeDb";

const ID = ({ handleValidateID, cardType, pid, className = "" }) => {
  const [flipped, setFlipped] = useState(false);
  const [showBadge, setShowBadge] = useState(true);

  const handleFlip = () => {
    // Hide badge before flip
    setShowBadge(false);
    setFlipped((prev) => !prev);

    // Delay re-showing badge after flip (600ms = match transition)
    setTimeout(() => {
      setShowBadge(true);
    }, 500);
  };

  const id = pid?.[cardType];

  const { isValid = null } = id;

  return (
    <div className={className} style={{ width: "400px" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {showBadge && (
          <Badge
            isCompleted={isValid !== null}
            isValid={pid?.[cardType]?.isValid}
          />
        )}

        <div
          style={{
            perspective: "1000px",
            width: "400px",
            height: "230px",
            position: "relative",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <div
            className={`flip-wrapper ${flipped ? "flipped-id" : ""}`}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transition: "transform 0.6s",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front Image */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={`${Cloudinary.getEndpoint()}/${
                  pid?.[cardType]?.img?.front || ""
                }/users/${pid.email}/portfolio/${pid?.[cardType]?.type}/front`}
                alt="Front"
                className="shadow-lg"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                }}
              />
            </div>

            {/* Back Image */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={`${Cloudinary.getEndpoint()}/${
                  pid?.[cardType]?.img?.back || ""
                }/users/${pid.email}/portfolio/${pid?.[cardType]?.type}/back`}
                alt="Back"
                className="shadow-lg"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          {/* Flip Button */}
          <MDBBtn
            size="sm"
            color="light"
            title="Flip Card"
            className="position-absolute px-3 p-1"
            style={{
              color: "blue",
              bottom: "-2px",
              right: "0px",
              zIndex: 10,
            }}
            onClick={handleFlip}
          >
            <MDBIcon fas icon="exchange-alt" />
          </MDBBtn>

          <Options
            handleValidateID={(isValid) => handleValidateID(isValid, cardType)}
          />
        </div>
      </div>

      <div
        className="d-flex justify-content-between mt-n2 text-center"
        style={{
          fontSize: "0.9rem",
          lineHeight: "1.4",
        }}
      >
        <div title={HMO.getName(pid?.[cardType]?.name)}>
          {pid?.[cardType]?.type?.toUpperCase()}
        </div>
        <div>
          <strong>{pid?.[cardType]?.id || "N/A"}</strong>
        </div>
        <div>
          <strong>{dateFormat(pid?.[cardType]?.expiry)}</strong>
        </div>
      </div>
    </div>
  );
};

export default ID;
