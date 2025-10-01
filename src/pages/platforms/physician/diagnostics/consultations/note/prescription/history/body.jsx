import { MDBIcon } from "mdbreact";
import { useEffect, useRef } from "react";

export default function Body({ consultation }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const editorRef = useRef(null);

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
      ctx.drawImage(notesValue, 0, 0); // no stretching
    }
  }, [mode, notesValue]);

  return (
    <div
      className="checkup-data-prescription-card-body "
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

      {/* Type mode */}
      {mode === "type" && (
        <div
          id="editor"
          ref={editorRef}
          contentEditable={false}
          suppressContentEditableWarning={true}
          style={{ minHeight: "100px" }}
        />
      )}

      {/* Draw mode */}
      {mode === "draw" && <canvas ref={canvasRef} enableDrawing={false} />}
    </div>
  );
}
