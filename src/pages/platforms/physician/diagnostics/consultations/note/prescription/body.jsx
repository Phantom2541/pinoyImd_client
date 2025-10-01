import { MDBIcon } from "mdbreact";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPATIENT,
  SetCLUSTER,
} from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { UPDATE } from "../../../../../../../services/redux/slices/diagnostics/clinic/consultations";
import {
  capitalize,
  Cloudinary,
} from "../../../../../../../services/utilities";

export default function Body({ togglePanel }) {
  const { patient: appointment, cluster } = useSelector(
    ({ appointments }) => appointments
  );
  const { auth, token } = useSelector(({ auth }) => auth);
  const { fullName = {} } = auth;
  const { fname, lname } = fullName;
  const { consultation = {} } = appointment || {};

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const editorRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("draw"); // "draw" or "type"
  const [pencilCursor, setPencilCursor] = useState("auto");
  const [fontSize, setFontSize] = useState(16);

  // type mode notes
  const [typedNotes, setTypedNotes] = useState("");
  const savedSelection = useRef(null);

  const dispatch = useDispatch();

  // load notes only when appointment changes
  useEffect(() => {
    const savedNotes = appointment?.consultation?.prescription?.notes || "";
    setTypedNotes(savedNotes);

    if (editorRef.current) {
      editorRef.current.innerHTML = savedNotes;
    }
  }, [appointment]);

  // when switching into type mode, hydrate editor with current typedNotes
  useEffect(() => {
    if (mode === "type" && editorRef.current) {
      editorRef.current.innerHTML = typedNotes || "";
      editorRef.current.focus();

      const sel = window.getSelection();
      sel.removeAllRanges();

      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel.addRange(range);
    }
  }, [mode]);

  // save caret before leaving type mode
  useEffect(() => {
    if (mode !== "type" && editorRef.current) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        savedSelection.current = sel.getRangeAt(0);
      }
    }
  }, [mode]);

  // restore caret when entering type mode
  useEffect(() => {
    if (mode === "type" && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      sel.removeAllRanges();
      if (savedSelection.current) {
        sel.addRange(savedSelection.current);
      } else {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        sel.addRange(range);
      }
    }
  }, [mode]);

  // --- setup canvas whenever we enter draw mode
  useEffect(() => {
    if (mode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      canvas.style.cursor = `url(${dataURL}) 2 22, auto`;
    };

    img.src = url;
  }, [mode, fontSize]);

  // --- update font size
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.font = `${fontSize}px Arial`;
    }
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${fontSize}px`;
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

  // --- Reset
  const handleReset = () => {
    if (mode === "draw") {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      setTypedNotes("");
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
  };

  const getDrawingValue = () => {
    if (!canvasRef.current) return "";
    return canvasRef.current.toDataURL("image/png");
  };

  const handleSave = () => {
    const value = mode === "draw" ? getDrawingValue() : typedNotes;

    const payload = {
      patient: appointment.patient._id,
      appointment: appointment._id,
      ...consultation,
      prescription: {
        ...consultation?.prescription,
        mode,
        notes: value,
        fontSize,
      },
    };

    dispatch(UPDATE({ data: payload, token })).then(({ payload }) => {
      const _cluster = [...cluster];
      const apptIndex = _cluster.findIndex((p) => p._id === appointment?._id);
      _cluster[apptIndex] = { ...appointment, prescription: payload };

      dispatch(SetCLUSTER(_cluster));
      dispatch(SetPATIENT({ ...appointment, consultation: payload }));
    });

    togglePanel("prescription");
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

      {/* Type mode */}
      {mode === "type" && (
        <div
          id="editor"
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          style={{
            position: "absolute",
            top: "80px",
            left: "60px",
            fontSize: `${fontSize}px`,
            border: "none",
            outline: "none",
            background: "transparent",
            width: "400px",
            minHeight: "100px",
            cursor: "text",
          }}
          onInput={(e) => setTypedNotes(e.currentTarget.innerHTML)}
        />
      )}

      {/* Draw mode */}
      {mode === "draw" && (
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      )}

      <button
        className="checkup-data-note-save bg-success"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
