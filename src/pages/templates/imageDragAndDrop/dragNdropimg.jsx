import { useRef, useState, useEffect } from "react";
import { MDBIcon } from "mdbreact";
import Cropper from "react-easy-crop";
import "./style.css";

const ImageDragAndDrop = ({
  defaultImage = "",
  savedImg,
  downloadName = "downloaded-image.png",
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(defaultImage);
  const [fileName, setFileName] = useState(downloadName);
  const [isDefault, setIsDefault] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [rawImage, setRawImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    setPreview(defaultImage);
  }, [defaultImage]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      readImageFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      readImageFile(file);
    }
  };

  const readImageFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImage(reader.result);
      setFileName(file.name);
      setShowCropper(true);
      setIsAccepted(false);
      setIsDefault(false);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCropDone = async () => {
    const cropped = await getCroppedImg(rawImage, croppedAreaPixels);
    setPreview(cropped);
    setShowCropper(false);
    savedImg?.(null, cropped);
  };

  const handleRemove = () => {
    setPreview(defaultImage);
    setIsDefault(true);
    setIsAccepted(false);
    setRawImage(null);
    setShowCropper(false);
  };

  // ✅ Combined helper logic
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    // 🔥 Set white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🖼️ Draw the image over the white background
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg"); // you can keep using jpeg now
    });
  };

  return (
    <div
      className={`template-dragNdrop-dropImgArea
        ${isDraggingOver ? "show-border" : ""}
        ${isAccepted ? "accepted" : ""}
        ${isDefault ? "default" : ""}
      `}
      onClick={() => !showCropper && fileInputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsDraggingOver(true)}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsDraggingOver(false);
        }
      }}
    >
      {showCropper && rawImage ? (
        <>
          <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <Cropper
              image={rawImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
            }}
          >
            <button className="accept-btn" onClick={handleCropDone}>
              <MDBIcon icon="check-circle" size="2x" className="icon-accept" />
            </button>
            <button className="reject-btn" onClick={handleRemove}>
              <MDBIcon icon="times-circle" size="2x" className="icon-remove" />
            </button>
          </div>
        </>
      ) : (
        <>
          <img
            src={preview}
            alt="preview"
            className={isDraggingOver ? "dragging-preview" : "normal-preview"}
          />
          {isDraggingOver && (
            <span className="drop-text" style={{ opacity: 1 }}>
              Drop image here
            </span>
          )}
        </>
      )}

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
      />

      {!isDefault && !isAccepted && !showCropper && (
        <div className="icon-actions">
          <MDBIcon
            icon="check-circle"
            size="2x"
            className="icon-accept"
            onClick={(e) => {
              e.stopPropagation();
              setIsAccepted(true);
            }}
          />
          <MDBIcon
            icon="times-circle"
            size="2x"
            className="icon-remove"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          />
        </div>
      )}

      {(isAccepted || isDefault) && !showCropper && (
        <div className="hover-buttons">
          <a
            href={preview}
            download={fileName}
            className="download-button"
            onClick={(e) => e.stopPropagation()}
          >
            <MDBIcon icon="download" /> Download
          </a>
          <button
            className="upload-button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current.click();
            }}
          >
            <MDBIcon icon="upload" /> Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageDragAndDrop;
