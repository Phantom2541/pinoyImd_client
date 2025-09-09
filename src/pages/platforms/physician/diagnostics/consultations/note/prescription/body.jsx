import { MDBIcon } from "mdbreact";
import React, { useRef, useEffect, useState } from "react";

export default function Body() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    // Set canvas resolution based on container size
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;

    // --- Create pencil icon cursor ---
    const iconCanvas = document.createElement("canvas");
    iconCanvas.width = 16;
    iconCanvas.height = 16;
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
      iconCtx.drawImage(img, 0, 0, 16, 16);
      URL.revokeObjectURL(url);

      const dataURL = iconCanvas.toDataURL("image/png");
      canvas.style.cursor = `url(${dataURL}) 0 12, auto`;
    };

    img.src = url;
  }, []);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="checkup-data-prescription-card-body">
      <MDBIcon
        fas
        icon="prescription"
        className="checkup-data-prescription-card-body-icon"
      />
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <MDBIcon
        fas
        icon="prescription"
        className="checkup-data-prescription-card-body-icon2"
      />
    </div>
  );
}
