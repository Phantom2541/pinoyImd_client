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
import { generateDownload, resizeImageToCropSize } from "./cropImage";

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
  const [localImg, setLocalImg] = useState(null),
    [croppedArea, setCroppedArea] = useState(null),
    [crop, setCrop] = useState({ x: 0, y: 0 }),
    [zoom, setZoom] = useState(1),
    [showWarning, setShowWarning] = useState(false),
    [fitImg, setFitImg] = useState(false);

  useEffect(() => {
    setFitImg(false);
  }, [show]);

  useEffect(() => {
    if (img) {
      const image = new Image();
      image.src = img;
      image.onload = () => {
        if (image.width < cropSize.width || image.height < cropSize.height) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      };
    }
  }, [img, cropSize]);

  useEffect(() => {
    const fetchData = async () => {
      if (fitImg) {
        const resizedImg = await resizeImageToCropSize(img, cropSize);
        setLocalImg(resizedImg);
      } else {
        setLocalImg(img);
      }
    };

    fetchData();
  }, [fitImg, img, cropSize]);

  const handleDownload = async () => {
    const result = await generateDownload(localImg, ext, croppedArea, isUpload);
    if (isUpload) {
      handleUpload(result);
    }
    toggle();
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

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
          <MDBAlert color="warning" className={`text-center py-2 `}>
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
          />
        </div>
        <div className="d-flex">
          <p className="text-center text-muted mb-3">
            Do you want to <strong>fit the image</strong> to the crop area?
          </p>
          <input
            className="form-check-input"
            type="checkbox"
            checked={fitImg}
            onChange={() => setFitImg(!fitImg)}
            id={"fit-yes"}
          />
          <label htmlFor={`fit-yes`} className="label-table mr-2 ml-1">
            Yes
          </label>
          <input
            className="form-check-input"
            type="checkbox"
            id={"fit-no"}
            checked={!fitImg}
            onChange={() => setFitImg(!fitImg)}
          />
          <label htmlFor={`fit-no`} className="label-table">
            No
          </label>
        </div>
        {/* {show && (
          <MDBRangeInput min={1} max={3} value={zoom} getValue={setZoom} />
        )} */}
        <div className="text-center">
          <MDBBtn onClick={handleDownload} color="primary" rounded>
            {isUpload ? "Upload" : "Download"}
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
