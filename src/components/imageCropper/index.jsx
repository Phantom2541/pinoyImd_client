import React, { useEffect, useState } from "react";
import Modal from "./modal";

export default function ImageCropper({
  accept,
  label = "Crop",
  modalSize = "md",
  aspect = 1,
  cropSize,
  setIsShow = () => {},
  handleUpload = () => {},
  isUpload = false,
}) {
  const [show, setShow] = useState(false),
    [img, setImg] = useState(null),
    [ext, setExt] = useState("jpg");

  const toggle = () => setShow(!show);

  const handleChange = ({ target }) => {
    const file = target.files[0];

    if (!file) return;

    if (!file.type.includes("image")) return;

    if (file.type.includes("png")) setExt("png");

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      setImg(target.result);
      setShow(true);
    };

    reader.readAsDataURL(file);
    target.value = null;
  };

  useEffect(() => {
    setIsShow(show);
  }, [show, setIsShow]);

  return (
    <>
      <label htmlFor="cropImage" className="btn btn-primary btn-sm btn-rounded">
        {label}
      </label>
      <input
        id="cropImage"
        onChange={handleChange}
        type="file"
        className="d-none"
        accept={accept}
      />
      <Modal
        modalSize={modalSize}
        show={show}
        cropSize={cropSize}
        toggle={toggle}
        img={img}
        aspect={aspect}
        ext={ext}
        handleUpload={handleUpload}
        isUpload={isUpload}
      />
    </>
  );
}
