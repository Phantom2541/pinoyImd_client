import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBAlert,
} from "mdbreact";
import Cropper from "react-easy-crop";
import { resizeImageToCropSize } from "./cropImage";
import Spinner from "../../spinner";
import { useSelector } from "react-redux";
import SUIT from "./../../../assets/attire/suit.png";
import POLO from "./../../../assets/attire/polo.png";
import POLO_TSHIRT from "./../../../assets/attire/polo-tshirt.png";

const ATTIRE_OPTIONS = [
  { key: "suit", label: "Suit", src: SUIT },
  { key: "polo", label: "Polo", src: POLO },
  { key: "polo-tshirt", label: "Polo T-Shirt", src: POLO_TSHIRT },
];

export default function Modal({
  show,
  toggle,
  modalSize,
  img,
  aspect,
  ext,
  isUpload,
  handleUpload,
  cropSize = { width: 170, height: 170 },
}) {
  const { formSubmitted, isSuccess } = useSelector(({ auth }) => auth);

  const [localImg, setLocalImg] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  const [fitImg, setFitImg] = useState(false);
  const [attire, setAttire] = useState(null);

  // Reset fitImg when modal opens
  useEffect(() => setFitImg(false), [show]);

  // Check image dimensions for warning
  useEffect(() => {
    if (img) {
      const image = new Image();
      image.src = img;
      image.onload = () => {
        setShowWarning(
          image.width < cropSize.width || image.height < cropSize.height
        );
      };
    }
  }, [img, cropSize]);

  // Resize image if fitImg
  useEffect(() => {
    const fetchImg = async () => {
      setLocalImg(fitImg ? await resizeImageToCropSize(img, cropSize) : img);
    };
    fetchImg();
  }, [fitImg, img, cropSize]);

  // Close modal after successful form submission
  useEffect(() => {
    if (show && !formSubmitted && isSuccess) toggle();
  }, [formSubmitted, isSuccess, show, toggle]);

  const handleDownload = async () => {
    if (!croppedArea) return;

    const canvas = document.createElement("canvas");
    canvas.width = croppedArea.width;
    canvas.height = croppedArea.height;
    const ctx = canvas.getContext("2d");

    const baseImg = new Image();
    baseImg.crossOrigin = "anonymous";
    baseImg.src = localImg;

    baseImg.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        baseImg,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height
      );

      const drawAttire = () => {
        if (!attire) return false;
        const attireObj = ATTIRE_OPTIONS.find((a) => a.key === attire);
        if (!attireObj) return false;

        const attireImg = new Image();
        attireImg.src = attireObj.src;

        attireImg.onload = () => {
          const scale = canvas.width / attireImg.width;
          const newWidth = attireImg.width * scale;
          const newHeight = attireImg.height * scale;
          const x = (canvas.width - newWidth) / 2;
          const y = canvas.height - newHeight;

          ctx.drawImage(attireImg, x, y, newWidth, newHeight);
          finishDownload();
        };
        return true;
      };

      const finishDownload = () => {
        const result = canvas.toDataURL(`image/${ext}`);
        if (isUpload) handleUpload(result);
        else {
          const link = document.createElement("a");
          link.href = result;
          link.download = `image.${ext}`;
          link.click();
        }
      };

      if (!drawAttire()) finishDownload();
    };
  };

  const onCropComplete = (_, croppedAreaPixels) =>
    setCroppedArea(croppedAreaPixels);

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size={modalSize}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="crop" className="mr-2" />
        Crop Image
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        {showWarning && (
          <MDBAlert color="warning" className="text-center py-2">
            ⚠️ The uploaded image is smaller than the crop size (
            {cropSize.width}×{cropSize.height}). This may cause the final
            cropped image to look blurry or stretched.
          </MDBAlert>
        )}
        <p className="text-center text-muted small mb-2">
          📐 Crop area size:{" "}
          <strong>
            {cropSize.width}px × {cropSize.height}px
          </strong>
        </p>
        <div
          className="border mb-3"
          style={{ height: "300px", position: "relative" }}
        >
          <Cropper
            image={localImg}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropSize={cropSize}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition={false}
          />
          {attire && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: cropSize.width,
                height: cropSize.height,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                zIndex: 5,
              }}
            >
              <img
                src={ATTIRE_OPTIONS.find((a) => a.key === attire)?.src}
                alt={attire}
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>
        {/* Fit image options */}
        <div className="d-flex">
          <p className="text-center text-muted mb-3">
            Do you want to <strong>fit the image</strong> to the crop area?
          </p>
          <input
            className="form-check-input"
            type="checkbox"
            checked={fitImg}
            onChange={() => setFitImg(!fitImg)}
            id="fit-yes"
          />
          <label htmlFor="fit-yes" className="label-table mr-2 ml-1">
            Yes
          </label>
          <input
            className="form-check-input"
            type="checkbox"
            id="fit-no"
            checked={!fitImg}
            onChange={() => setFitImg(!fitImg)}
          />
          <label htmlFor="fit-no" className="label-table">
            No
          </label>
        </div>
        {/* Single checkbox for attire toggle */}
        <div className="d-flex align-items-center mb-2">
          <p className="text-center text-muted mb-0 mr-2">
            Do you want to change attire?
          </p>
          <input
            className="form-check-input"
            type="checkbox"
            checked={!!attire}
            onChange={() => setAttire(attire ? null : "suit")}
            id="attire-toggle"
          />
          <label htmlFor="attire-toggle" className="label-table ml-1">
            Yes
          </label>
        </div>
        {/* Attire selection buttons */}
        {attire && (
          <div className="mb-3 ml-4">
            <p className="text-muted mb-1">Choose attire:</p>
            <div className="d-flex">
              {ATTIRE_OPTIONS.map((a) => (
                <MDBBtn
                  key={a.key}
                  color={attire === a.key ? "primary" : "light"}
                  size="sm"
                  className="mr-2"
                  onClick={() => setAttire(a.key)}
                >
                  {a.label}
                </MDBBtn>
              ))}
            </div>
          </div>
        )}
        <div className="text-center">
          <MDBBtn
            onClick={handleDownload}
            color="primary"
            rounded
            disabled={formSubmitted}
          >
            {isUpload ? "Upload" : "Download"}{" "}
            <Spinner formSubmitted={formSubmitted} />
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
