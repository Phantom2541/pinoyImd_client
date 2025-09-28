import { useEffect, useState } from "react";
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
  isStatic = false,
  inputId = "cropImage", // default keeps old behavior
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
      <label htmlFor={inputId} className="btn btn-primary btn-sm btn-rounded">
        {label}
      </label>
      <input
        id={inputId}
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
        isStatic={isStatic}
        img={img}
        aspect={aspect}
        ext={ext}
        handleUpload={handleUpload}
        isUpload={isUpload}
      />
    </>
  );
}
