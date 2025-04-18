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
import generateDownload from "./cropImage";

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
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showWarning, setShowWarning] = useState(false);

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

  const handleDownload = async () => {
    const result = await generateDownload(img, ext, croppedArea, isUpload);
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
            image={img}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropSize={cropSize}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
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
