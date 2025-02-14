import React, { useState } from "react";
// import { MDBRow, MDBCol, MDBCard, MDBContainer } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD } from "../../services/redux/slices/assets/persons/auth";
import { UPDATE } from "../../services/redux/slices/assets/persons/personnels";
import { ENDPOINT } from "../../services/utilities";
export default function Resume() {
  const [pdfSrc, setPdfSrc] = useState(`${ENDPOINT}/public/sample.pdf`),
    [isPdfValid, setIsPdfValid] = useState(true),
    { auth, token, resume } = useSelector(({ auth }) => auth),
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
                name: "resume.pdf",
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
                  resume: "resume.pdf",
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
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {resume && (
        <div className="pdf-container">
          <iframe
            title="PDF Viewer"
            width="100%"
            height="500px"
            src={!resume ? resume : pdfSrc}
          ></iframe>
        </div>
      )}
      {!isPdfValid && <p>Please select a valid PDF file.</p>}
    </div>
  );
}
