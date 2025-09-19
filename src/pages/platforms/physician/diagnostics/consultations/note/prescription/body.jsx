import { MDBIcon } from "mdbreact";
import React, { useRef, useEffect, useState } from "react";
import Signature from "./../../../../../../../assets/templateSampleSignature.png";

export default function Body() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("draw"); // "draw" or "type"
  const [pencilCursor, setPencilCursor] = useState("auto");
  const [fontSize, setFontSize] = useState(16); // default font size

  // --- setup canvas for draw mode
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = `${fontSize}px Arial`;
    ctxRef.current = ctx;

    // --- Create pencil icon cursor ---
    const iconCanvas = document.createElement("canvas");
    iconCanvas.width = 24;
    iconCanvas.height = 24;
    const iconCtx = iconCanvas.getContext("2d");

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="black" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 
        4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 
        0-17l46.1-46.1c18.7-18.7 49.1-18.7 
        67.9 0l60.1 60.1c18.7 18.7 
        18.7 49.1 0 67.9zM284.2 
        99.8L21.4 362.6.4 481.2c-2.9 
        16.4 11.4 30.7 27.8 
        27.8l118.6-21 262.8-262.8c4.7-4.7 
        4.7-12.3 0-17l-111-111c-4.7-4.7-12.3-4.7-17 
        0z"/>
      </svg>
    `;

    const img = new Image();
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      iconCtx.drawImage(img, 0, 0, 24, 24);
      URL.revokeObjectURL(url);

      const dataURL = iconCanvas.toDataURL("image/png");
      setPencilCursor(`url(${dataURL}) 2 22, auto`);
    };

    img.src = url;
  }, []);

  // --- update cursor based on mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mode === "draw") {
      canvas.style.cursor = pencilCursor;
    }
  }, [mode, pencilCursor]);

  // --- update font size (for type editor + canvas text)
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.font = `${fontSize}px Arial`;
    }
    const editor = document.getElementById("editor");
    if (editor) {
      editor.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  // --- Drawing functions
  const startDrawing = (e) => {
    if (mode !== "draw") return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (mode !== "draw" || !isDrawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (mode !== "draw") return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  // --- Reset function
  const handleReset = () => {
    if (mode === "draw") {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      const editor = document.getElementById("editor");
      if (editor) editor.innerHTML = "";
    }
  };

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
      {/* Toolbar */}
      <div
        className="checkup-data-prescription-card-body-toggle"
        style={{ marginBottom: "10px", display: "flex", gap: "10px" }}
      >
        <button onClick={handleReset}>🗑️ Reset</button>

        <button onClick={() => setMode("draw")}>✏️ Draw</button>
        <button onClick={() => setMode("type")}>⌨️ Type</button>

        {/* Font size control */}

        {mode === "type" && (
          <select
            className="checkup-data-prescription-card-body-font-size"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            <option value={12}>12px</option>
            <option value={16}>16px</option>
            <option value={20}>20px</option>
            <option value={24}>24px</option>
            <option value={32}>32px</option>
          </select>
        )}
      </div>

      {/* Coupon bond style type mode */}
      <div
        className="checkup-data-prescription-card-body-type"
        id="editor"
        contentEditable={mode === "type"}
        suppressContentEditableWarning={true}
        style={{
          fontSize: `${fontSize}px`,
          display: mode === "type" ? "block" : "none",
        }}
      />

      {/* Draw mode */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          display: mode === "draw" ? "block" : "none",
        }}
      />
      <div className="checkup-data-prescription-card-body-signature">
        <img alt="signature" src={Signature} draggable={false} />
        <span>Dr. Kevin magtalas</span>
      </div>
    </div>
  );
}
