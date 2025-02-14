import React, { useState } from "react";
import Modal from "./modal";

export default function ImageCropper({ accept, aspect = 1 }) {
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
  };

  return (
    <>
      <label htmlFor="cropImage" className="btn btn-primary btn-sm btn-rounded">
        crop
      </label>
      <input
        id="cropImage"
        onChange={handleChange}
        type="file"
        className="d-none"
        accept={accept}
      />
      <Modal show={show} toggle={toggle} img={img} aspect={aspect} ext={ext} />
    </>
  );
}
