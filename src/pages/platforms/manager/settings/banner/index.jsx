import React, { useState } from "react";
import {
  MDBAlert,
  MDBAnimation,
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBMask,
  MDBProgress,
  MDBRow,
  MDBTable,
  MDBView,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  ENDPOINT,
  fullName,
  getAge,
  isJpegOrJpgFile,
} from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD } from "../../../../../services/redux/slices/assets/persons/auth";
import { FailedBanner } from "../../../../../services/utilities";

const array = new Array(5).fill().map((_, index) => index);

export default function Banner() {
  const { auth } = useSelector(({ auth }) => auth);
  const { addToast } = useToasts();
  const [preview, setPreview] = useState("");
  const { activePlatform, company, token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const handleError = (message) => {
    document.getElementById("upload-banner").value = "";
    addToast(message, {
      appearance: "warning",
    });
  };

  const handleChange = (file) => {
    if (!isJpegOrJpgFile(file))
      return handleError("Invalid file extension, must be jpg.");

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      const { result } = target;

      const img = new Image();
      img.src = result;

      img.onload = () => {
        // Check the width and height
        if (img.width !== 850 && img.height !== 85)
          return handleError("Image dimensions must be 850x85 pixels.");

        dispatch(
          UPLOAD({
            data: {
              path: `credentials/${company.name}/${activePlatform.name}`,
              base64: result.split(",")[1],
              name: `banner.jpg`,
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
    link.href = FailedBanner;
    link.download = "Preset-Banner.jpg";
    link.click();
  };

  return (
    <div style={{ width: "850px" }} className="mx-auto">
      <MDBCard>
        <MDBCardBody>
          <MDBView hover>
            <img
              src={
                preview ||
                `${ENDPOINT}/public/credentials/${company.name}/${activePlatform.name}/banner.jpg`
              }
              className="img-fluid"
              alt={company?.name || "Default Banner"}
              onError={(e) => (e.target.src = FailedBanner)}
            />
            <MDBMask overlay="grey-strong d-flex align-items-center">
              <MDBBtnGroup className="mx-auto">
                <MDBBtn color="warning" size="sm" onClick={handleDownload}>
                  <MDBIcon icon="download" />
                </MDBBtn>
                <label
                  className="btn btn-sm btn-primary"
                  htmlFor="upload-banner"
                >
                  <MDBIcon icon="upload" />
                </label>
              </MDBBtnGroup>
              <input
                id="upload-banner"
                type="file"
                className="d-none"
                accept=".jpg"
                onChange={(e) => handleChange(e.target.files[0])}
              />
            </MDBMask>
          </MDBView>
          <MDBRow className="my-2">
            <MDBCol md="6">
              <h6>
                Name: <strong>{fullName(auth?.fullName)}</strong>
              </h6>
              <h6>
                Age: {getAge(auth?.dob)} | Gender:&nbsp;
                {auth?.isMale ? "Male" : "Female"}
              </h6>
              <h6>Category: Walkin</h6>
            </MDBCol>
            <MDBCol md="6">
              <h6 className="text-md-end">
                Date: {new Date().toDateString()},&nbsp;
                {new Date().toLocaleTimeString()}
              </h6>
            </MDBCol>
          </MDBRow>
          <MDBAlert
            color="primary"
            className="text-uppercase text-center py-0 mb-1"
          >
            <h5 style={{ letterSpacing: "30px" }} className="mb-0 fw-bold">
              CHEMISTRY
            </h5>
          </MDBAlert>
          <MDBTable hover bordered responsive className="mb-0 text-center">
            <thead>
              <tr>
                <th className="py-0" />
                <th className="text-center py-0" colSpan={2}>
                  Conventional Unit
                </th>
                <th className="text-center py-0" colSpan={2}>
                  System International Unit
                </th>
              </tr>
              <tr>
                <th className="py-0 text-left">Service</th>
                <th className="py-0">Result</th>
                <th className="py-0">Reference</th>
                <th className="py-0">Result</th>
                <th className="py-0">Reference</th>
              </tr>
            </thead>
            <tbody>
              {array
                .sort(() => Math.random() - 0.5)
                .map((num, rI) => (
                  <tr key={`presetRow-${rI}`}>
                    {new Array(5).fill().map((_, cI) => (
                      <td key={`presetCol-${cI}`}>
                        <div
                          style={{
                            width: cI === 0 && `${num * 50 + 100}px`,
                          }}
                        >
                          <MDBAnimation
                            type="fadeIn"
                            infinite
                            delay={`${rI + cI}00ms`}
                            duration="5000ms"
                          >
                            <MDBProgress animated color="light" value={100} />
                          </MDBAnimation>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
