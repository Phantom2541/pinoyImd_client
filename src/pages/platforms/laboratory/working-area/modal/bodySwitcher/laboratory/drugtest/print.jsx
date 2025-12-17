import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  IMAGE,
  UPLOAD,
} from "./../../../../../../../../services/redux/slices/assets/persons/auth";

const TOTAL_FINGERS = 10;

export default function FingerPrint({ task, setTask }) {
  const [images, setImages] = useState(Array(TOTAL_FINGERS).fill(null));
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { token, progressBar } = useSelector(({ auth }) => auth);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file && progressBar === 100) {
      dispatch(IMAGE(URL.createObjectURL(file)));
      setFile(null);
      addToast("Image Updated Successfully.", { appearance: "success" });
    }
  }, [progressBar, file, dispatch, addToast]);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target.result;

      const updatedImages = [...images];
      updatedImages[index] = imgSrc;
      setImages(updatedImages);

      setTask((prev) => ({ ...prev, image: "profile.jpg" }));
      dispatch(
        UPLOAD({
          data: {
            path: `${task?.patient?.email || "unknown"}`,
            base64: imgSrc.split(",")[1],
            name: "profile.jpg",
          },
          token,
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (index) => {
    inputRefs.current[index]?.click();
  };

  return (
    <>
      <style>
        {`
          .drugTest-image-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100px;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
          }

          .drugTest-upload-btn {
            background-color: #ffc107;
            border: none;
            width: 100%;
            height: 100%;
            color: white;
            font-weight: 500;
            cursor: pointer;
          }

          .drugTest-uploaded-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 5px;
          }
        `}
      </style>

      <div
        className="d-flex justify-content-center flex-column"
        style={{ gap: "1rem" }}
      >
        {[0, 1].map((row) => (
          <div
            key={row}
            className="d-flex justify-content-center"
            style={{ gap: "1rem" }}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const index = row * 5 + i;
              return (
                <div className="drugTest-image-wrapper" key={index}>
                  {images[index] ? (
                    <img
                      src={images[index]}
                      alt={`Uploaded ${index + 1}`}
                      className="drugTest-uploaded-image"
                    />
                  ) : (
                    <button
                      className="drugTest-upload-btn"
                      onClick={() => triggerFileInput(index)}
                    >
                      Upload
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
