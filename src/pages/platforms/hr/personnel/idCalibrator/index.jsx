import React, { useState } from "react";
import "./style.css";
import { fakeEMP } from "./fakeDB";
import ID from "./id";
import Setting from "./toolkit/setting";
import DraggableButtons from "./buttons";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE } from "../../../../../services/redux/slices/assets/branches";

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
  const [lockAspect, setLockAspect] = useState(false);

  const dispatch = useDispatch();
  const options = ["portrait", "landscape"];
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const { ct: branch } = useSelector(({ branches }) => branches);
  try {
    const ctData = branch.ct ? JSON.parse(branch.ct) : null;
    console.log("ct", ctData);
  } catch (err) {
    console.error("Invalid JSON in branch.ct:", branch.ct, err);
  }

  // 🔹 Eto yung onSave arrow function
  const onSave = () => {
    const dfp = {};

    placedValues.forEach((p) => {
      const base = { x: p.x, y: p.y };

      if (p.style) {
        // ✅ Text styles
        if (p.style.fontFamily) base.font = p.style.fontFamily;
        if (p.style.fontSize) base.size = parseInt(p.style.fontSize);
        if (p.style.color) base.color = p.style.color;
        if (p.style.fontWeight) base.fontWeight = p.style.fontWeight;
        if (p.style.fontStyle) base.fontStyle = p.style.fontStyle;
        if (p.style.letterSpacing)
          base.letterSpacing = parseInt(p.style.letterSpacing);

        // ✅ Image styles
        if (p.style.width) base.width = parseInt(p.style.width);
        if (p.style.height) base.height = parseInt(p.style.height);
        if (p.style.borderRadius)
          base.borderRadius = parseInt(p.style.borderRadius);
        if (p.style.opacity !== undefined) base.opacity = p.style.opacity;
        if (p.style.border) base.border = p.style.border;
      }

      dfp[p.key] = base;
    });

    const saveData = {
      layout,
      cf: frontImage || "",
      cb: backImage || "",
      dfp,
    };

    console.log("=== SAVE DATA ===");
    console.log(saveData);
    dispatch(
      UPDATE({
        token,
        data: { _id: activePlatform.branchId, ct: JSON.stringify(saveData) },
      })
    );
  };

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

  const lockAspectRatio = (
    newWidth,
    newHeight,
    lock,
    aspectRatio,
    driver = "width"
  ) => {
    if (!lock || !aspectRatio) {
      return {
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      };
    }

    if (driver === "width") {
      return {
        width: `${newWidth}px`,
        height: `${Math.round(newWidth / aspectRatio)}px`,
      };
    } else {
      return {
        width: `${Math.round(newHeight * aspectRatio)}px`,
        height: `${newHeight}px`,
      };
    }
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
        lockAspect={lockAspect}
        lockAspectRatio={lockAspectRatio}
      />

      {/* Layout Setting */}
      <Setting
        layout={layout}
        setLayout={setLayout}
        options={options}
        onReset={handleReset}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        onUpdateValueStyle={handleUpdateValueStyle}
        onSave={onSave}
        lockAspect={lockAspect}
        setLockAspect={setLockAspect}
        lockAspectRatio={lockAspectRatio}
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
        selectedSide={selectedSide}
      />
    </div>
  );
}
