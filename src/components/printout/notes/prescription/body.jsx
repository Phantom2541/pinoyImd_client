import { MDBIcon } from "mdbreact";
import { useRef, useEffect } from "react";
import { capitalize } from "../../../../services/utilities";

export default function Body({ note }) {
  const { physician = {} } = note || {};
  const { fullName = {} } = physician;
  const { fname, lname } = fullName;
  const { consultation = {} } = note || {};
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const { prescription = {} } = consultation || {};
  const { mode = "", fontSize, notes: notesValue } = prescription;

  useEffect(() => {
    if (mode === "type") {
      document.getElementById("editor").innerHTML = notesValue;
      document.getElementById("editor").style.fontSize = fontSize;
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0); // no stretching
      };
      img.src = notesValue; // notesValue should be the Base64 image of the drawing
    }
  }, [mode]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.font = `${fontSize}px Arial`;
    }
    const editor = document.getElementById("editor");
    if (editor) {
      editor.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  return (
    <div
      className="checkup-data-prescription-card-body"
      style={{ position: "relative" }}
    >
      <MDBIcon
        fas
        icon="prescription"
        className="checkup-data-prescription-card-body-icon"
      />
      <MDBIcon
        fas
        icon="prescription"
        className="checkup-data-prescription-card-body-icon2"
      />

      <div
        className="checkup-data-prescription-card-body-type mt-5"
        id="editor"
        suppressContentEditableWarning={true}
        style={{
          fontSize: `${fontSize}px`,
          display: mode === "type" ? "block" : "none",
        }}
      />

      {/* Draw mode */}
      <canvas
        ref={canvasRef}
        style={{
          display: mode === "draw" ? "block" : "none",
        }}
      />

      <div className="checkup-data-prescription-card-body-signature">
        <span>
          Dr. {capitalize(fname)} {capitalize(lname)}
        </span>
      </div>
    </div>
  );
}
