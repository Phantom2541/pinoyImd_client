import React, { useEffect, useState } from "react";
import {
  MDBAnimation,
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBMask,
  MDBProgress,
  MDBTypography,
  MDBView,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { ENDPOINT } from "./../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  UPLOAD,
  RESET,
} from "./../../../../../services/redux/slices/assets/persons/auth";
import { FailedLogo } from "./../../../../../services/utilities";
import ImageCropper from "../../../../../components/images/imageCropper";

const array = new Array(5).fill().map((_, index) => index);

export default function Logo() {
  const { addToast } = useToasts();
  const { company, token, isLoading, message, isSuccess } = useSelector(
    ({ auth }) => auth
  );
  const dispatch = useDispatch();
  const [preview, setPreview] = useState("");
  const [showImgCropper, setShowImgCropper] = useState(false);

  useEffect(() => {
    setShowImgCropper(false);
    dispatch(RESET());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleUpload = (base64) => {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const newBlob = new Blob([ab], { type: "image/png" });
    const objectUrl = URL.createObjectURL(newBlob);
    setPreview(objectUrl);
    dispatch(
      UPLOAD({
        data: {
          path: `companies/${company.name}`,
          base64: base64.split(",")[1],
          name: "logo.png",
        },
        token,
      })
    );
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = FailedLogo;
    link.download = "Preset-Logo.jpg";
    link.click();
  };

  return (
    <>
      <div style={{ width: "31rem" }} className="mx-auto">
        <MDBTypography
          variant="h6"
          noteColor="warning"
          className="mt-2 "
          note
          noteTitle={"Description: "}
        >
          Hover over the logo to upload or download a new one.
        </MDBTypography>
      </div>
      <div style={{ width: "230px" }} className="mx-auto">
        <MDBCard>
          <MDBCardBody>
            <MDBView hover={!showImgCropper}>
              <img
                src={
                  preview ||
                  `${ENDPOINT}/public/companies/${company.name}/logo.png`
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
                    title="Download"
                    onClick={handleDownload}
                  >
                    <MDBIcon icon="download" />
                  </MDBBtn>
                  <ImageCropper
                    handleUpload={handleUpload}
                    cropSize={{ width: 230, height: 80 }}
                    setIsShow={(show) => setShowImgCropper(show)}
                    isUpload
                    label={
                      <>
                        <MDBIcon icon="upload" />
                      </>
                    }
                    accept={".png"}
                  />
                </MDBBtnGroup>
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
    </>
  );
}
