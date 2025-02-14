import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD } from "../../services/redux/slices/assets/persons/auth";
import { UPDATE } from "../../services/redux/slices/assets/persons/personnels";
import { ENDPOINT } from "../../services/utilities";

export default function Medical() {
  const [pdfSrc, setPdfSrc] = useState(`${ENDPOINT}/public/sample.png`),
    [isPdfValid, setIsPdfValid] = useState(true),
    { auth, token, medcert } = useSelector(({ auth }) => auth),
    { personnel } = useSelector(({ personnels }) => personnels),
    dispatch = useDispatch();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type === "application/pdf") {
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
                name: "medical.pdf",
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
                  medical: "medical.pdf",
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
      {medcert && (
        <div className="pdf-container">
          <img
            src={!medcert ? medcert : pdfSrc}
            alt="src"
            title="PDF Viewer"
            width="100%"
            height="500px"
          />
        </div>
      )}
      {!isPdfValid && <p>Please select a valid PDF file.</p>}
    </div>
  );
}
