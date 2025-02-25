import React, { useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBRangeInput,
} from "mdbreact";
import Cropper from "react-easy-crop";
import generateDownload from "./cropImage";

export default function Modal({
  show,
  toggle,
  img,
  aspect,
  ext,
  isUpload,
  handleUpload,
}) {
  const [croppedArea, setCroppedArea] = useState(null),
    [crop, setCrop] = useState({ x: 0, y: 0 }),
    [zoom, setZoom] = useState(1);

  const handleDownload = async () => {
    generateDownload(img, ext, croppedArea, isUpload);
    if (isUpload) {
      handleUpload(await generateDownload(img, ext, croppedArea, isUpload));
    }
    toggle();
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="crop" className="mr-2" />
        Crop Image
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <div
          className="border mb-3"
          style={{ height: "300px", position: "relative" }}
        >
          <Cropper
            image={img}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <MDBRangeInput min={1} max={3} value={zoom} getValue={setZoom} />
        <MDBBtn onClick={handleDownload} color="primary" rounded size="sm">
          {isUpload ? "Upload" : "Download"}
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
}
