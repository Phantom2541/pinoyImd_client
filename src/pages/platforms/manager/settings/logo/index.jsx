import React, { useState } from "react";
import {
  MDBAnimation,
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBMask,
  MDBProgress,
  MDBView,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { ENDPOINT } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD } from "../../../../../services/redux/slices/assets/persons/auth";
import { FailedLogo } from "../../../../../services/utilities";

const array = new Array(5).fill().map((_, index) => index);

export default function Logo() {
  const { addToast } = useToasts();
  const { onDuty, company, token, isLoading } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [preview, setPreview] = useState("");

  const handleError = (message) => {
    document.getElementById("upload-banner").value = "";
    addToast(message, {
      appearance: "warning",
    });
  };

  const handleChange = (file) => {
    if (isLoading) return;

    if (!file.type === "image/png")
      return handleError("Invalid file extension, must be png.");

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      const { result } = target;

      const img = new Image();
      img.src = result;

      img.onload = () => {
        // Check the width and height
        if (img.width !== 230 && img.height !== 80)
          return handleError("Image dimensions must be 230x80 pixels.");

        dispatch(
          UPLOAD({
            data: {
              path: `credentials/${company.name}/${onDuty.name}`,
              base64: result.split(",")[1],
              name: `logo.png`,
            },
            token,
          })
        );

        setPreview(URL.createObjectURL(file));
      };
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = FailedLogo;
    link.download = "Preset-Logo.jpg";
    link.click();
  };

  return (
    <div style={{ width: "230px" }} className="mx-auto">
      <MDBCard>
        <MDBCardBody>
          <MDBView hover>
            <img
              src={
                preview ||
                `${ENDPOINT}/public/credentials/${company.name}/${onDuty.name}/logo.png`
              }
              className="img-fluid"
              alt={company?.name || "Default Logo"}
              onError={(e) => (e.target.src = FailedLogo)}
            />
            <MDBMask overlay="grey-strong d-flex align-items-center">
              <MDBBtnGroup className="mx-auto">
                <MDBBtn
                  disabled={isLoading}
                  color="warning"
                  size="sm"
                  onClick={handleDownload}
                >
                  <MDBIcon icon="download" />
                </MDBBtn>
                <label className="btn btn-sm btn-primary" htmlFor="upload-logo">
                  <MDBIcon icon="upload" />
                </label>
              </MDBBtnGroup>
              <input
                id="upload-logo"
                type="file"
                className="d-none"
                accept=".png"
                onChange={(e) => handleChange(e.target.files[0])}
              />
            </MDBMask>
          </MDBView>
          <hr />
          {array
            .sort(() => Math.random() - 0.5)
            .map((index, i) => (
              <div
                key={`sampleSidebar-${index}`}
                style={{
                  width: `${index * 10 + 100}px`,
                }}
              >
                <MDBAnimation
                  type="fadeIn"
                  infinite
                  delay={`${i + 1}00ms`}
                  duration="2500ms"
                >
                  <MDBProgress color="light" value={100} />
                </MDBAnimation>
                <br />
              </div>
            ))}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
