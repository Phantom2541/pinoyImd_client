import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
} from "mdbreact";

import { UPLOAD } from "../../../../../services/redux/slices/assets/persons/auth";

export default function SignaturePreview({
  show,
  toggle,
  selected,
  setImageErrors,
}) {
  const { token } = useSelector(({ auth }) => auth),
    [img, setImg] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      setImg(selected.signature);
    }
  }, [show, selected]);
  // use for direct values like strings and numbers
  const handleReUpload = (e) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImg(e.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const handleUpload = () => {
    if (!img) return; // safety check

    dispatch(
      UPLOAD({
        data: {
          path: `users/${selected.email}`,
          base64: img.split(",")[1],
          name: `signature.png`,
        },
        token,
      })
    ).then(() => {
      setImageErrors((prev) => ({ ...prev, [selected.email]: false }));
      toggle();
    });
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="sm"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="signature" className="mr-2" />
        Signature Preview
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <div className="d-flex justify-content-center">
          <img
            src={img}
            alt={selected.email}
            height={"120px"}
            width={"120px"}
          />
        </div>
        <div className="d-flex justify-content-center mt-3">
          <MDBBtn
            size="md"
            color="warning"
            onClick={() => document.getElementById(`re-upload`).click()}
          >
            Re upload
          </MDBBtn>
          <MDBBtn size="md" color="primary" onClick={handleUpload}>
            Upload
          </MDBBtn>

          <input
            id={`re-upload`}
            type="file"
            accept="image/png"
            style={{ display: "none" }}
            onChange={(e) => handleReUpload(e)}
          />
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
