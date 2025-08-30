import React, { useEffect, useState } from "react";
import {
  MDBAlert,
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
  MDBTypography,
  MDBView,
  MDBAnimation,
  MDBBadge,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  Cloudinary,
  fullName,
  getAge,
} from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  UPLOAD,
  RESET,
} from "../../../../../../services/redux/slices/assets/persons/auth";
import { FailedBanner } from "../../../../../../services/utilities";
import ImageCropper from "../../../../../../components/images/imageCropper";
import { BROWSE } from "../../../../../../services/redux/slices/assets/branches";
import "./style.css";
import { orderBy } from "lodash";

const array = new Array(5).fill().map((_, index) => index);

const Banner = () => {
  const { auth, message, isSuccess } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ branches }) => branches);
  const { addToast } = useToasts();
  const [preview, setPreview] = useState("");
  const [showImgCropper, setShowImgCropper] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(""); // "left" | "right" | ""
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch();
  const [imgAvailable, setImgAvailable] = useState(false);

  const { activePlatform, company, token } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;

  // Fetch collections
  useEffect(() => {
    dispatch(BROWSE({ token, key: { companyId: companyId._id } }));
  }, [dispatch, token, companyId]);

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

  const handleUpload = (base64, branch) => {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const newBlob = new Blob([ab], { type: "image/png" });

    const objectUrl = URL.createObjectURL(newBlob);
    const image = new Image();
    image.onload = () => {
      setPreview(objectUrl);
    };
    image.src = objectUrl;
    const formData = Cloudinary.buildFileForm(
      base64,
      `companies/${companyId.name}/${branch}`,
      "banner"
    );
    dispatch(
      UPLOAD({
        data: formData,
        token,
      })
    );
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = FailedBanner;
    link.download = "Preset-Banner.jpg";
    link.click();
  };

  // navigation handlers (play animation first, then change index)
  const ANIM_MS = 500;
  const handleNext = () => {
    if (
      isAnimating ||
      !sortedCollections ||
      currentIndex >= sortedCollections.length - 1
    )
      return;

    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
    setDirection("left");

    setTimeout(() => {
      setIsAnimating(false);
      setDirection("");
    }, ANIM_MS);
  };

  const handlePrev = () => {
    if (isAnimating || !sortedCollections || currentIndex <= 0) return;

    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
    setDirection("right");

    setTimeout(() => {
      setIsAnimating(false);
      setDirection("");
    }, ANIM_MS);
  };

  // ✅ Sort collections for display order
  const sortedCollections = orderBy(
    collections || [],
    [
      (o) => !o.isMain, // main branches first
      (o) => o.settings?.status?.trim().toLowerCase() !== "active", // active first
      (o) => o.name.toLowerCase().trim(), // alphabetical
    ],
    ["asc", "asc", "asc"]
  );

  if (!sortedCollections || sortedCollections.length === 0) {
    return <p className="text-center">No collections found</p>;
  }

  const collection = sortedCollections[currentIndex];
  const { name, isMain, settings } = collection;

  // decide class: left, right, or default fade
  const wrapperClass =
    direction === "left"
      ? "bannerFadeInLeft"
      : direction === "right"
      ? "bannerFadeInRight"
      : "";

  const shadowColor =
    settings?.status === "Active"
      ? "#198754"
      : settings?.status === "Draft"
      ? "#6f42c1"
      : settings?.status === "Expired"
      ? "#dc3545"
      : settings?.status === "Suspended"
      ? "#ffc107"
      : settings?.status === "Cancelled"
      ? "#b23c17"
      : "";

  return (
    <div>
      <div style={{ width: "850px" }} className="mx-auto position-relative">
        <MDBTypography
          variant="h6"
          noteColor="warning"
          className="mt-2"
          note
          noteTitle={"Description: "}
        >
          Hover over the banner to upload or download a new one.
        </MDBTypography>

        {/* key changes when currentIndex or direction changes -> remount and play animation */}
        <div key={`${currentIndex}-${direction}`} className={wrapperClass}>
          <MDBCard style={{ boxShadow: `0 0 7px ${shadowColor}` }}>
            <MDBCardBody>
              {imgAvailable && (
                <MDBTypography
                  tag="h4"
                  className="d-flex justify-content-center align-items-center my-3 text-uppercase"
                  align="center"
                >
                  <span style={{ color: shadowColor, fontWeight: "bold" }}>
                    {company?.name} — {name}
                  </span>
                  {isMain && (
                    <MDBBadge color="warning" className="ml-2">
                      Main
                    </MDBBadge>
                  )}
                </MDBTypography>
              )}
              <MDBView hover={!showImgCropper}>
                <img
                  src={
                    preview ||
                    `${Cloudinary.getEndpoint()}/companies/${
                      companyId.name
                    }/${name}/banner.png`
                  }
                  style={{
                    width: "100%",
                    height: "85px",
                    objectFit: "fill",
                  }}
                  alt={companyId?.name || "Default Banner"}
                  onError={(e) => {
                    console.log(e.target.src);
                    e.target.src = FailedBanner;
                    setImgAvailable(!imgAvailable);
                  }}
                />

                {/* Only show Typography if image is NOT available */}

                <MDBMask overlay="grey-strong d-flex align-items-center">
                  <MDBBtnGroup className="mx-auto">
                    <MDBBtn
                      title="Download"
                      color="warning"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <MDBIcon icon="download" />
                    </MDBBtn>

                    <ImageCropper
                      handleUpload={(base64) => handleUpload(base64, name)}
                      cropSize={{ width: 850, height: 85 }}
                      modalSize="xl"
                      setIsShow={(show) => setShowImgCropper(show)}
                      isUpload
                      label={<MDBIcon icon="upload" title="Upload" />}
                      accept={".png"}
                    />
                  </MDBBtnGroup>
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
              <MDBTable
                hover
                bordered
                responsive
                className="mb-0 text-center position-relative"
                style={{ overflow: "hidden" }}
              >
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
                                duration="4000ms"
                              >
                                <MDBProgress
                                  animated
                                  color="light"
                                  value={100}
                                />
                              </MDBAnimation>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
                <div className="Banner-waterMark">
                  <span>Subscription</span>
                  <span
                    style={{
                      color: settings.status === "Active" ? "lightgray" : "red",
                    }}
                  >
                    {console.log("settings.subscription", settings.status)}

                    {settings.subscription || "Demo"}
                  </span>
                  <span>{settings.status.toUpperCase()}</span>
                </div>
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </div>

        <button
          className="banner-pagination-left"
          style={{
            cursor: isAnimating ? "not-allowed" : "pointer",
          }}
          disabled={currentIndex === 0 || isAnimating}
          onClick={handlePrev}
        >
          <MDBIcon icon="chevron-left" />
        </button>
        <span className="banner-pagination-current">
          {currentIndex + 1} / {sortedCollections.length}
        </span>
        <button
          className="banner-pagination-right"
          style={{
            cursor: isAnimating ? "not-allowed" : "pointer",
          }}
          disabled={
            currentIndex === sortedCollections.length - 1 || isAnimating
          }
          onClick={handleNext}
        >
          <MDBIcon icon="chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
