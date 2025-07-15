import { capitalize } from "lodash";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useState } from "react";

const Options = ({ handleValidateID }) => {
  const [showValidationOptions, setShowValidationOptions] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: "-60px",
        transform: "translateY(-50%)",
        zIndex: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0px",
      }}
    >
      {["question", "valid", "invalid"].map((type, index) => {
        const isQuestion = type === "question";
        const icon =
          type === "valid"
            ? "check"
            : type === "invalid"
            ? "exclamation-triangle"
            : null;

        return (
          <div
            key={type}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Button */}
            {isQuestion ? (
              <MDBBtn
                size="sm"
                floating
                color="info"
                title={capitalize(type)}
                onClick={() => setShowValidationOptions((prev) => !prev)}
                style={{
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  fontWeight: "bold",
                  zIndex: 2,
                  transition: "transform 0.3s ease",
                }}
              >
                ?
              </MDBBtn>
            ) : (
              <MDBBtn
                size="sm"
                color="light"
                title={capitalize(type)}
                onClick={() => handleValidateID(type === "valid")}
                style={{
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  fontWeight: "bold",
                  opacity: showValidationOptions ? 1 : 0,
                  transform: showValidationOptions ? "scale(1)" : "scale(0.9)",
                  transition: "all 0.3s ease",
                  pointerEvents: showValidationOptions ? "auto" : "none",
                  backgroundColor: "white",
                }}
              >
                <MDBIcon
                  fas
                  icon={icon}
                  className={
                    type === "valid"
                      ? "text-success"
                      : type === "invalid"
                      ? "text-warning"
                      : ""
                  }
                />
              </MDBBtn>
            )}

            {/* Dots below each button except last */}
            {index < 2 && (
              <div
                style={{
                  height: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  opacity: showValidationOptions ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <span style={{ fontSize: "10px", lineHeight: "4px" }}>·</span>
                <span style={{ fontSize: "10px", lineHeight: "4px" }}>·</span>
                <span style={{ fontSize: "10px", lineHeight: "4px" }}>·</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Options;
