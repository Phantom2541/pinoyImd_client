import React, { useState } from "react";
import "./style.css";
import { fakeEMP } from "./fakeDB";
import ID from "./id";
import Setting from "./toolkit/setting";
import DraggableButtons from "./buttons";

export default function IdCalibrator() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [layout, setLayout] = useState("Portrait");
  const [draggedValue, setDraggedValue] = useState(null);
  const [floatingValue, setFloatingValue] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [placedValues, setPlacedValues] = useState([]);

  const options = ["Portrait", "Landscape"];

  const filteredKeys = Object.keys(fakeEMP).filter(
    (key) => !["cf", "cb", "layout", "dfp"].includes(key)
  );

  const handleFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) setFrontImage(URL.createObjectURL(file));
  };

  const handleBackChange = (e) => {
    const file = e.target.files[0];
    if (file) setBackImage(URL.createObjectURL(file));
  };

  // ------------------- Drag & Drop -------------------
  const handleDragStart = (e, value) =>
    e.dataTransfer.setData("text/plain", value);

  // ------------------- Click & Follow Cursor -------------------
  const handleClickValue = (value) => {
    setFloatingValue(value);
    document.body.style.cursor = "none";
  };

  const handleMouseMove = (e) => {
    if (floatingValue) setCursorPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  return (
    <div className="id-calibrator-main-container" onMouseMove={handleMouseMove}>
      {/* ID Preview */}
      <ID
        frontImage={frontImage}
        backImage={backImage}
        handleFrontChange={handleFrontChange}
        handleBackChange={handleBackChange}
        filteredKeys={filteredKeys}
        fakeEMP={fakeEMP}
        layout={layout}
        placedValues={placedValues}
        setPlacedValues={setPlacedValues}
        draggedValue={draggedValue}
        setDraggedValue={setDraggedValue}
        floatingValue={floatingValue}
        setFloatingValue={setFloatingValue}
        handleDragStart={handleDragStart}
        handleClickValue={handleClickValue}
        cursorPos={cursorPos}
        setCursorPos={setCursorPos}
      />

      {/* Layout Setting */}
      <Setting layout={layout} setLayout={setLayout} options={options} />

      {/* Draggable Buttons */}
      <DraggableButtons
        fakeEMP={fakeEMP}
        filteredKeys={filteredKeys}
        placedValues={placedValues}
        handleDragStart={handleDragStart}
        handleClickValue={handleClickValue}
      />
    </div>
  );
}
