import React, { useEffect, useState } from "react";

import "./style.css";
import { fakeEMP } from "./fakeDB";
import ID from "./id";
import Setting from "./toolkit/setting";
import DraggableButtons from "./buttons";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE,
  CTBROWSE,
} from "../../../../../services/redux/slices/assets/branches";

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
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    setLoading(true);
    dispatch(
      CTBROWSE({ token, data: { _id: activePlatform.branchId } })
    ).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!branch.ct) return;

    let ctData;
    try {
      ctData = JSON.parse(branch.ct);
    } catch (err) {
      console.error("Invalid JSON in branch.ct:", branch.ct, err);
      return;
    }

    setLayout(ctData.layout || "portrait");
    setFrontImage(ctData.cf || null);
    setBackImage(ctData.cb || null);
    setLoading(false);

    const dfp = ctData.dfp || {};
    const newPlaced = [];

    // Key mapping
    const keyMap = {
      fullName: "emp",
      profile: "img",
      id: "empID",
      "phone number": "pn",
      birthday: "dob",
      guardian: "guardian",
      address: "address",
      department: "department",
      signature: "signature",
    };

    Object.keys(dfp).forEach((dfpKey) => {
      const mappedKey = keyMap[dfpKey] || dfpKey;

      // Kunin ang value mula sa fakeEMP front/back
      let value;
      if (fakeEMP.front[mappedKey] !== undefined) {
        value = fakeEMP.front[mappedKey];
      } else if (fakeEMP.back[mappedKey] !== undefined) {
        value = fakeEMP.back[mappedKey];
      } else {
        value = null;
      }

      // Gamitin ang target na naka-save sa dfp, default sa front kung wala
      const target =
        dfp[dfpKey].target ||
        (fakeEMP.front[mappedKey] !== undefined ? "front" : "back");

      if (value !== null) {
        newPlaced.push({
          id: Date.now() + Math.random(),
          key: dfpKey,
          value,
          x: dfp[dfpKey].x || 0,
          y: dfp[dfpKey].y || 0,
          target, // ✅ dito na gagamitin ang saved target
          style: { ...dfp[dfpKey] },
        });
      }
    });

    setPlacedValues(newPlaced);
  }, [branch]);

  // 🔹 Eto yung onSave arrow function
  const onSave = () => {
    const dfp = {};

    placedValues.forEach((p) => {
      const base = { x: p.x, y: p.y, target: p.target };

      if (p.style) {
        // ✅ Text styles
        if (p.style.fontFamily) base.fontFamily = p.style.fontFamily;
        if (p.style.fontSize) base.fontSize = parseInt(p.style.fontSize);
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

    console.log("======Saved Data=========");
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
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFrontImage(reader.result); // Base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleBackChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBackImage(reader.result); // Base64 string
    };
    reader.readAsDataURL(file);
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
      prev.map((p, i) => {
        if (i === selectedValue.index && p.target === selectedValue.target) {
          // extract x/y kung meron
          const { x, y, ...rest } = updates;
          return {
            ...p,
            x: x !== undefined ? x : p.x,
            y: y !== undefined ? y : p.y,
            style: { ...p.style, ...rest },
          };
        }
        return p;
      })
    );

    setSelectedValue((prev) => {
      if (!prev) return prev;
      const { x, y, ...rest } = updates;
      return {
        ...prev,
        x: x !== undefined ? x : prev.x,
        y: y !== undefined ? y : prev.y,
        style: { ...prev.style, ...rest },
      };
    });
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
      style={{ position: "relative" }}
    >
      {/* Loading overlay */}
      {loading ? (
        <div className="id-calibrator-skeleton-wrapper">
          <div className="id-calibrator-sekeleton-id-preview-wrapper">
            <div className="id-calibrator-skeleton-id-preview" />
            <div className="id-calibrator-skeleton-id-preview" />
          </div>
          <div className="id-calibrator-skeleton-settings-panel"></div>
          <div className="id-calibrator-skeleton-buttons"></div>
        </div>
      ) : (
        <>
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
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
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
            placedValues={placedValues}
          />

          {/* Draggable Buttons */}
          <DraggableButtons
            fakeEMP={fakeEMP[selectedSide]}
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
        </>
      )}
    </div>
  );
}
