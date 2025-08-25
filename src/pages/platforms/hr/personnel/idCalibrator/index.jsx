import React, { useState } from "react";
import "./style.css";
import { fakeEMP } from "./fakeDB";
import ID from "./id";
import Setting from "./toolkit/setting";
import DraggableButtons from "./buttons";

export default function IdCalibrator() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [layout, setLayout] = useState("portrait");
  const [draggedValue, setDraggedValue] = useState(null);
  const [floatingValue, setFloatingValue] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [placedValues, setPlacedValues] = useState([]);
  const [selectedSide, setSelectedSide] = useState("front"); // 👈 bago
  const [selectedValue, setSelectedValue] = useState(null);
  const [showAllValues, setShowAllValues] = useState(false);

  const options = ["portrait", "landscape"];

  // ngayon, filter lang per side
  const filteredKeys = Object.keys(fakeEMP[selectedSide] || {});

  const handleFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) setFrontImage(URL.createObjectURL(file));
  };

  const handleBackChange = (e) => {
    const file = e.target.files[0];
    if (file) setBackImage(URL.createObjectURL(file));
  };

  const handleDragStart = (e, value) =>
    e.dataTransfer.setData("text/plain", value);

  const handleClickValue = (value) => {
    setFloatingValue(value);
    document.body.style.cursor = "none";
  };

  const handleMouseMove = (e) => {
    if (floatingValue) setCursorPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  // inside IdCalibrator
  const handleReset = () => {
    setPlacedValues([]);
    setFrontImage(null);
    setBackImage(null);
    setFloatingValue(null);
    setDraggedValue(null);
    setCursorPos({ x: 0, y: 0 });
    // optional: reset layout & side
    setLayout("portrait");
    setSelectedSide("front");
  };

  const handleUpdateValueStyle = (updates) => {
    if (!selectedValue) return;

    setPlacedValues((prev) =>
      prev.map((p, i) =>
        i === selectedValue.index && p.target === selectedValue.target
          ? { ...p, style: { ...p.style, ...updates } }
          : p
      )
    );

    // 🔹 Update selectedValue agad para di na kailangan i-reselect
    setSelectedValue((prev) =>
      prev ? { ...prev, style: { ...prev.style, ...updates } } : prev
    );
  };

  return (
    <div
      className={`id-calibrator-main-container ${layout || "landscape"}`}
      onMouseMove={handleMouseMove}
    >
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
        setSelectedSide={setSelectedSide}
        selectedSide={selectedSide}
        selectedValue={selectedValue} // 👈 ipasa sa ID
        setSelectedValue={setSelectedValue} // 👈 ipasa sa ID
        showAllValues={showAllValues}
      />

      {/* Layout Setting */}
      <Setting
        layout={layout}
        setLayout={setLayout}
        options={options}
        onReset={handleReset}
        isDisabled={!selectedValue}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        onUpdateValueStyle={handleUpdateValueStyle}
      />

      {/* Draggable Buttons */}
      <DraggableButtons
        fakeEMP={fakeEMP[selectedSide]} // 👈 per side na lang
        filteredKeys={filteredKeys}
        placedValues={placedValues}
        handleDragStart={handleDragStart}
        handleClickValue={handleClickValue}
        frontImage={frontImage}
        backImage={backImage}
        setShowAllValues={setShowAllValues}
        showAllValues={showAllValues}
        setPlacedValues={setPlacedValues}
      />
    </div>
  );
}
