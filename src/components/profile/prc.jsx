import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD } from "../../services/redux/slices/assets/persons/auth";
import { UPDATE } from "../../services/redux/slices/assets/persons/personnels";
import { ENDPOINT } from "../../services/utilities";

export default function PRC() {
  const [pdfSrc, setPdfSrc] = useState(`${ENDPOINT}/public/sample.png`),
    [isPdfValid, setIsPdfValid] = useState(true),
    { auth, token, prc } = useSelector(({ auth }) => auth),
    { personnel } = useSelector(({ personnels }) => personnels),
    dispatch = useDispatch();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type === "image/jpeg") {
        const reader = new FileReader();
        reader.onload = (e) => {
          file.resume = file.name;
          setPdfSrc(e.target.result);
          setIsPdfValid(true);
          dispatch(
            UPLOAD({
              data: {
                path: `${auth.email}`,
                base64: reader.result.split(",")[1],
                name: "prc.jpg",
              },
              token,
            })
          );
          dispatch(
            UPDATE({
              data: {
                ...personnel,
                _id: personnel._id,
                file201: {
                  ...personnel.file201,
                  prc: "prc.jpg",
                },
              },
              token,
            })
          );
          // URL.createObjectUrl;
        };
        reader.readAsDataURL(file);
      } else {
        setIsPdfValid(false);
      }
    }
  };

  return (
    <div className="pdf-uploader">
      <input
        type="file"
        accept={"image/jpeg, image/jpg"}
        onChange={handleFileChange}
      />
      {prc && (
        <div className="pdf-container">
          <img
            src={!prc ? prc : pdfSrc}
            alt="src"
            title="PDF Viewer"
            width="100%"
            height="500px"
          />
        </div>
      )}
      {!isPdfValid && <p>Please select a valid Image file.</p>}
    </div>
  );
}
